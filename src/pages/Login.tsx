import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Login() {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep('otp');
      toast({
        title: "OTP Sent",
        description: "Please check your email for the verification code",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast({
        title: "Error",
        description: "Please enter the OTP",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Demo auth: OTP email flow; also allow a/a quick login
      const isQuick = email.trim() === 'a' && otp.trim() === 'a'
      if (!isQuick && otp.trim().length < 1) throw new Error('Invalid OTP')

      const role = (email.toLowerCase() === 'admin@pel.com' || email.toLowerCase() === 'it@pel.com') ? 'hod' : 'user'
      const empID = email
      localStorage.setItem('empID', empID)
      localStorage.setItem('userRole', role)
      localStorage.setItem('userEmail', email)

      toast({
        title: "Login Successful",
        description: `Welcome to SPOT, ${email}`,
      });

      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid OTP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">SPOT: Smart Processing of Tickets</CardTitle>
          <CardDescription>
            {step === 'email' ? 'Enter your email to receive OTP' : 'Enter the OTP sent to your email'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 'email' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendOtp()}
                />
              </div>
              
              {/* Quick Login Options */}
              <div className="border-t pt-4 space-y-2">
                <p className="text-sm text-muted-foreground text-center">Quick Login for Testing</p>
                <div className="grid grid-cols-1 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => { setEmail('admin@pel.com'); handleSendOtp(); }}
                    className="text-xs"
                  >
                    Admin/HOD (Vehicle & Admin)
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => { setEmail('it@pel.com'); handleSendOtp(); }}
                    className="text-xs"
                  >
                    IT HOD
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => { setEmail('user@pel.com'); handleSendOtp(); }}
                    className="text-xs"
                  >
                    Common User
                  </Button>
                </div>
              </div>
              
              <Button 
                onClick={handleSendOtp} 
                className="w-full" 
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send OTP
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleVerifyOtp()}
                  maxLength={6}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setStep('email')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleVerifyOtp} 
                  className="flex-1" 
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}