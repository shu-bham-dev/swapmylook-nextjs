"use client";

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import {
  User,
  Lock,
  LogOut,
  Camera,
  Trash2,
  Save,
  Eye,
  EyeOff,
  AlertCircle,
  Upload
} from 'lucide-react';
import { apiService, type UserProfile } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load profile data on component mount
  useEffect(() => {
    // Check if user is authenticated
    if (!apiService.isAuthenticated()) {
      toast.error('Authentication required', {
        description: 'Please log in to access settings.',
      });
      router.push('/login');
      return;
    }
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getProfileSettings();
      setProfileData(response.profile);
      setFormData(response.profile);
    } catch (error) {
      console.error('Failed to load profile data:', error);
      toast.error('Failed to load settings', {
        description: 'Could not load your profile data. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!formData) return;

    try {
      setIsSaving(true);
      const response = await apiService.updateProfileSettings(formData);
      setProfileData(response.profile);
      toast.success('Profile updated', {
        description: 'Your profile settings have been updated successfully.',
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Update failed', {
        description: 'Could not update your profile. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', {
        description: 'Please upload an image file (JPEG, PNG, etc.)',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large', {
        description: 'Please upload an image smaller than 5MB',
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Upload file using the same process as model and outfit uploads
      const uploadResponse = await apiService.uploadFile(file, 'other');
      
      // Update profile picture in form data with the actual uploaded URL
      const newProfilePictureUrl = uploadResponse.imageAsset.url;
      setFormData(prev => ({ ...prev, profilePicture: newProfilePictureUrl }));
      
      // Automatically save the profile to update the backend with the new profile picture
      await apiService.updateProfileSettings({ profilePicture: newProfilePictureUrl });
      
      // Reload profile data to get the updated profile
      await loadProfileData();
      
      toast.success('Profile picture updated', {
        description: 'Your profile picture has been uploaded and saved successfully.',
      });
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
      toast.error('Upload failed', {
        description: 'Could not upload your profile picture. Please try again.',
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Password mismatch', {
        description: 'New password and confirmation do not match.',
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password too short', {
        description: 'New password must be at least 6 characters long.',
      });
      return;
    }

    try {
      setIsSaving(true);
      await apiService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password updated', {
        description: 'Your password has been changed successfully.',
      });
    } catch (error) {
      console.error('Failed to change password:', error);
      toast.error('Password change failed', {
        description: 'Could not change your password. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE MY ACCOUNT') {
      toast.error('Invalid confirmation', {
        description: 'Please type "DELETE MY ACCOUNT" exactly to confirm deletion.',
      });
      return;
    }

    try {
      await apiService.deleteAccount(deleteConfirmation);
      toast.success('Account deleted', {
        description: 'Your account has been deactivated successfully.',
      });
      // Redirect to login page after account deletion
      setTimeout(() => {
        apiService.clearAuthData();
        router.push('/login');
      }, 2000);
    } catch (error) {
      console.error('Failed to delete account:', error);
      toast.error('Deletion failed', {
        description: 'Could not delete your account. Please try again.',
      });
    }
  };

  const handleLogout = async () => {
    try {
      await apiService.logout();
      toast.success('Logged out', {
        description: 'You have been successfully logged out.',
      });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed', {
        description: 'There was an issue logging out.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-200 rounded-full animate-spin border-t-pink-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your account preferences and profile information
          </p>
        </div>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-pink-50">
            <TabsTrigger value="profile" className="data-[state=active]:bg-pink-200 text-xs md:text-sm">
              <User className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="account" className="data-[state=active]:bg-pink-200 text-xs md:text-sm">
              <Lock className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Account
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="p-6">
              <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6">
                {/* Profile Picture */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <Avatar className="w-20 h-20 md:w-24 md:h-24">
                      <AvatarImage 
                        src={formData?.profilePicture || profileData?.profilePicture} 
                        alt="Profile" 
                      />
                      <AvatarFallback className="text-lg md:text-xl">
                        {profileData?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="absolute -bottom-2 -right-2 w-7 h-7 md:w-8 md:h-8 rounded-full bg-pink-500 hover:bg-pink-600 text-white p-0"
                    >
                      {isUploading ? (
                        <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-white"></div>
                      ) : (
                        <Camera className="w-3 h-3 md:w-4 md:h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData?.name || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData?.email || ''}
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData?.gender || 'prefer-not-to-say'}
                      onValueChange={(value: string) => setFormData(prev => ({ ...prev, gender: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Profile Picture</Label>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex items-center space-x-1"
                      >
                        <Upload className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="text-xs md:text-sm">
                          {isUploading ? 'Uploading...' : 'Upload Photo'}
                        </span>
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG up to 5MB
                      </p>
                    </div>
                  </div>

                  <Button 
                    onClick={handleProfileUpdate} 
                    disabled={isSaving}
                    className="bg-pink-500 hover:bg-pink-600 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Change Password */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Enter new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    onClick={handlePasswordChange} 
                    disabled={isSaving}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    {isSaving ? 'Changing Password...' : 'Change Password'}
                  </Button>
                </div>
              </Card>

              {/* Account Actions */}
              <div className="space-y-6">
                {/* Logout */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Session</h3>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </Card>

                {/* Delete Account */}
                <Card className="p-6 border-red-200">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-red-600 mb-2">Delete Account</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Account
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your account
                              and remove all your data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="space-y-4">
                            <Label htmlFor="deleteConfirmation">
                              Type "DELETE MY ACCOUNT" to confirm:
                            </Label>
                            <Input
                              id="deleteConfirmation"
                              value={deleteConfirmation}
                              onChange={(e) => setDeleteConfirmation(e.target.value)}
                              placeholder="DELETE MY ACCOUNT"
                            />
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDeleteAccount}
                              className="bg-red-600 hover:bg-red-700"
                              disabled={deleteConfirmation !== 'DELETE MY ACCOUNT'}
                            >
                              Delete Account
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}