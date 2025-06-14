
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Home, Users } from "lucide-react";

const RoleSelection = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const selectRole = async (role: 'renter' | 'resident') => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ user_type: role })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Role selected!",
        description: `You are now set up as a ${role}.`,
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error setting role:', error);
      toast({
        title: "Failed to set role",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg mx-auto mb-4"></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Role</h1>
          <p className="text-gray-600">Are you the main renter or a resident roommate?</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Renter Card */}
          <Card className="shadow-xl border-0 hover:shadow-2xl transition-shadow cursor-pointer" onClick={() => selectRole('renter')}>
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-blue-600">I'm a Renter</CardTitle>
              <CardDescription className="text-base">
                I'm the main tenant who collects rent from roommates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">What you can do:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Create and manage households</li>
                  <li>• Set rent amounts and due dates</li>
                  <li>• Create monthly bills</li>
                  <li>• Track all roommate payments</li>
                  <li>• Send payment reminders</li>
                  <li>• Export payment reports</li>
                </ul>
              </div>
              <Button 
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                onClick={() => selectRole('renter')}
                disabled={loading}
              >
                {loading ? "Setting up..." : "I'm a Renter"}
              </Button>
            </CardContent>
          </Card>

          {/* Resident Card */}
          <Card className="shadow-xl border-0 hover:shadow-2xl transition-shadow cursor-pointer" onClick={() => selectRole('resident')}>
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-600">I'm a Resident</CardTitle>
              <CardDescription className="text-base">
                I'm a roommate who pays my share of the rent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">What you can do:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Join existing households</li>
                  <li>• View your payment amounts</li>
                  <li>• Mark payments as completed</li>
                  <li>• See payment history</li>
                  <li>• Get payment reminders</li>
                  <li>• Export your payment records</li>
                </ul>
              </div>
              <Button 
                className="w-full mt-4 bg-green-600 hover:bg-green-700"
                onClick={() => selectRole('resident')}
                disabled={loading}
              >
                {loading ? "Setting up..." : "I'm a Resident"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Don't worry - you can change your role later in settings</p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
