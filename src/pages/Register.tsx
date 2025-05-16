
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { addUser } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'admin' | 'teacher' | 'student',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value as 'admin' | 'teacher' | 'student' }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      addUser({
        username: formData.username,
        name: formData.name,
        password: formData.password,
        role: formData.role,
        isActive: true
      });
      
      toast({
        title: "Registration successful",
        description: "Your account has been created. Please login."
      });
      
      navigate('/login');
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "An error occurred during registration.",
        variant: "destructive"
      });
      console.error(error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Register
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Create a new account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="role">Role</Label>
              <Select onValueChange={handleRoleChange} defaultValue={formData.role}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Button type="submit" className="w-full">
                Register
              </Button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account? {" "}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
