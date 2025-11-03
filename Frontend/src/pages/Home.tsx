import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Home as HomeIcon, Shield, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    navigate(`/properties?search=${searchQuery}`);
  };

  const features = [
    {
      icon: HomeIcon,
      title: 'Quality Properties',
      description: 'Verified listings with detailed information and high-quality images',
    },
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'Safe and secure payment processing with Razorpay integration',
    },
    {
      icon: TrendingUp,
      title: 'Easy Management',
      description: 'Comprehensive dashboard for landlords and tenants',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">PropertyHub</h1>
          <div className="flex gap-3">
            {user ? (
              <>
                <Button onClick={() => navigate(user.role === 'tenant' ? '/tenant/dashboard' : user.role === 'landlord' ? '/landlord/dashboard' : '/admin/dashboard')}>
                  Dashboard
                </Button>
                <Button variant="outline" onClick={() => navigate('/properties')}>
                  Browse Properties
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button onClick={() => navigate('/register')}>
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/10 to-background py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-foreground mb-6">
            Find Your Perfect Home
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover quality rental properties and manage your leases with ease. Whether you're a tenant or landlord, we've got you covered.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search by city, area, or property type..."
                className="pl-10 h-12 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button size="lg" className="h-12 px-8" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">
            Why Choose PropertyHub?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-card p-6 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h4 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h4>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-16 px-4">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-foreground mb-6">
            Ready to Get Started?
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of satisfied tenants and landlords using our platform
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/register')}>
              Create Account
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/properties')}>
              Browse Properties
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 PropertyHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
