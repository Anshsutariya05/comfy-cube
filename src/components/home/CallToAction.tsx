
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container text-center">
        <h2 className="text-3xl font-medium mb-6">Ready to Transform Your Home?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
          Discover our curated collection of furniture pieces that blend style, comfort, and functionality.
        </p>
        <Button asChild size="lg" variant="secondary" className="font-medium">
          <Link to="/products">Shop Our Collection</Link>
        </Button>
      </div>
    </section>
  );
};

export default CallToAction;
