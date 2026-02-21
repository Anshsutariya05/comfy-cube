#!/usr/bin/env bash
# =============================================================
# ComfyCube — Supabase Setup Script
# Runs migrations, uploads images to storage, and seeds the DB
# =============================================================

set -e  # Exit on any error

SUPABASE_CLI="$HOME/.local/bin/supabase"
PROJECT_REF="brpniojfngjsctxkllgp"
SEED_IMAGES_DIR="$(dirname "$0")/../supabase/seed-images"
BUCKET="product-images"

# Colour helpers
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
info()  { echo -e "${GREEN}[✓]${NC} $1"; }
warn()  { echo -e "${YELLOW}[!]${NC} $1"; }
error() { echo -e "${RED}[✗]${NC} $1"; exit 1; }

echo ""
echo "================================================="
echo "  ComfyCube — Supabase Setup"
echo "================================================="
echo ""

# ── Step 1: Check CLI is installed ───────────────────────────
if ! command -v "$SUPABASE_CLI" &>/dev/null; then
  error "Supabase CLI not found at $SUPABASE_CLI. Run the install step first."
fi
info "Supabase CLI found: $($SUPABASE_CLI --version)"

# ── Step 2: Authenticate ─────────────────────────────────────
echo ""
warn "You need to be logged in to Supabase."
echo "  Running: supabase login"
echo ""
$SUPABASE_CLI login

# ── Step 3: Link project ─────────────────────────────────────
echo ""
info "Linking to project: $PROJECT_REF"
cd "$(dirname "$0")/.."
$SUPABASE_CLI link --project-ref "$PROJECT_REF"

# ── Step 4: Push migrations ───────────────────────────────────
echo ""
info "Pushing database migrations..."
$SUPABASE_CLI db push

# ── Step 5: Create storage bucket (via API if not done by migration) ─
echo ""
info "Creating storage bucket '$BUCKET' (if not already exists)..."
# The bucket is created via migration (20240101000002_storage_setup.sql)
# This is just a verification step
$SUPABASE_CLI storage ls --project-ref "$PROJECT_REF" 2>/dev/null \
  | grep -q "$BUCKET" \
  && info "Bucket '$BUCKET' already exists." \
  || warn "Bucket may not exist yet — it will be created by the migration."

# ── Step 6: Upload images to storage ─────────────────────────
echo ""
info "Uploading product images to Supabase Storage..."
for img in "$SEED_IMAGES_DIR"/*.jpg; do
  filename="$(basename "$img")"
  echo "  Uploading: $filename"
  $SUPABASE_CLI storage cp "$img" "ss://$BUCKET/$filename" --project-ref "$PROJECT_REF" 2>/dev/null \
    && echo "    ✓ $filename" \
    || echo "    ! $filename (may already exist)"
done

# ── Step 7: Run seed SQL ──────────────────────────────────────
echo ""
info "Seeding database with categories and products..."
$SUPABASE_CLI db seed

echo ""
echo "================================================="
echo "  Setup complete!"
echo ""
echo "  Project URL: https://$PROJECT_REF.supabase.co"
echo "  Storage:     https://$PROJECT_REF.supabase.co/storage/v1/object/public/$BUCKET/"
echo "================================================="
echo ""
