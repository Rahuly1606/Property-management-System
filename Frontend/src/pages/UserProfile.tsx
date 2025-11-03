import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Lock,
    Shield,
    Calendar,
    Edit2,
    Save,
    X,
    Camera,
    ArrowLeft
} from 'lucide-react';
import api from '@/services/api';

const UserProfile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    // Profile state
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: '',
        profileImage: '',
    });

    // Edit mode states
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editedProfile, setEditedProfile] = useState({ ...profileData });

    // Password change state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Loading states
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    useEffect(() => {
        if (user) {
            loadUserProfile();
        }
    }, [user]);

    const loadUserProfile = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/users/${user?.id}`);
            const data = response.data;

            const profile = {
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                email: data.email || '',
                phoneNumber: data.phoneNumber || '',
                address: data.address || '',
                profileImage: data.profileImage || '',
            };

            setProfileData(profile);
            setEditedProfile(profile);
        } catch (error) {
            toast({
                title: 'Failed to load profile',
                description: 'Please try again later',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async () => {
        setUpdating(true);
        try {
            await api.put(`/users/${user?.id}`, editedProfile);

            setProfileData(editedProfile);
            setIsEditingProfile(false);

            // Update user name in auth context
            const updatedUser = {
                ...user!,
                name: `${editedProfile.firstName} ${editedProfile.lastName}`.trim(),
            };
            localStorage.setItem('pms_user', JSON.stringify(updatedUser));

            toast({
                title: 'Profile updated successfully',
                description: 'Your changes have been saved',
            });
        } catch (error: any) {
            toast({
                title: 'Failed to update profile',
                description: error.response?.data?.message || 'Please try again',
                variant: 'destructive',
            });
        } finally {
            setUpdating(false);
        }
    };

    const handlePasswordChange = async () => {
        // Validation
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            toast({
                title: 'Missing fields',
                description: 'Please fill in all password fields',
                variant: 'destructive',
            });
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast({
                title: 'Passwords do not match',
                description: 'New password and confirm password must match',
                variant: 'destructive',
            });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast({
                title: 'Password too short',
                description: 'Password must be at least 6 characters long',
                variant: 'destructive',
            });
            return;
        }

        setChangingPassword(true);
        try {
            await api.put(`/users/${user?.id}/change-password`, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });

            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });

            toast({
                title: 'Password changed successfully',
                description: 'Please login again with your new password',
            });

            // Logout and redirect to login
            setTimeout(() => {
                logout();
                navigate('/login');
            }, 2000);
        } catch (error: any) {
            toast({
                title: 'Failed to change password',
                description: error.response?.data?.message || 'Current password may be incorrect',
                variant: 'destructive',
            });
        } finally {
            setChangingPassword(false);
        }
    };

    const handleCancelEdit = () => {
        setEditedProfile({ ...profileData });
        setIsEditingProfile(false);
    };

    const getInitials = () => {
        const firstName = profileData.firstName || user?.name.split(' ')[0] || '';
        const lastName = profileData.lastName || user?.name.split(' ')[1] || '';
        return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'landlord':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'tenant':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-card border-b border-border py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/${user?.role.toLowerCase()}/dashboard`)}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Button>
                        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Profile Header Card */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                                {/* Avatar Section */}
                                <div className="relative">
                                    <Avatar className="h-32 w-32 border-4 border-border">
                                        <AvatarImage src={profileData.profileImage} />
                                        <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
                                            {getInitials()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="absolute bottom-0 right-0 rounded-full shadow-lg"
                                        onClick={() => toast({ title: 'Photo upload coming soon!' })}
                                    >
                                        <Camera className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* User Info */}
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-3xl font-bold text-foreground mb-2">
                                        {profileData.firstName} {profileData.lastName}
                                    </h2>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                                        <Badge className={`${getRoleBadgeColor(user?.role || '')} capitalize`}>
                                            {user?.role}
                                        </Badge>
                                        <div className="flex items-center text-muted-foreground">
                                            <Mail className="h-4 w-4 mr-2" />
                                            {profileData.email}
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-4 text-sm text-muted-foreground">
                                        {profileData.phoneNumber && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4" />
                                                {profileData.phoneNumber}
                                            </div>
                                        )}
                                        {profileData.address && (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                {profileData.address}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tabs for Profile and Security */}
                    <Tabs defaultValue="profile" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="profile" className="gap-2">
                                <User className="h-4 w-4" />
                                Profile Information
                            </TabsTrigger>
                            <TabsTrigger value="security" className="gap-2">
                                <Shield className="h-4 w-4" />
                                Security
                            </TabsTrigger>
                        </TabsList>

                        {/* Profile Tab */}
                        <TabsContent value="profile">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Personal Information</CardTitle>
                                            <CardDescription>
                                                Update your personal details and contact information
                                            </CardDescription>
                                        </div>
                                        {!isEditingProfile && (
                                            <Button onClick={() => setIsEditingProfile(true)} variant="outline">
                                                <Edit2 className="h-4 w-4 mr-2" />
                                                Edit Profile
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* First Name */}
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input
                                                id="firstName"
                                                value={isEditingProfile ? editedProfile.firstName : profileData.firstName}
                                                onChange={(e) => setEditedProfile({ ...editedProfile, firstName: e.target.value })}
                                                disabled={!isEditingProfile}
                                                placeholder="Enter first name"
                                            />
                                        </div>

                                        {/* Last Name */}
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input
                                                id="lastName"
                                                value={isEditingProfile ? editedProfile.lastName : profileData.lastName}
                                                onChange={(e) => setEditedProfile({ ...editedProfile, lastName: e.target.value })}
                                                disabled={!isEditingProfile}
                                                placeholder="Enter last name"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={profileData.email}
                                                disabled
                                                className="bg-muted"
                                            />
                                            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                                        </div>

                                        {/* Phone */}
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input
                                                id="phone"
                                                value={isEditingProfile ? editedProfile.phoneNumber : profileData.phoneNumber}
                                                onChange={(e) => setEditedProfile({ ...editedProfile, phoneNumber: e.target.value })}
                                                disabled={!isEditingProfile}
                                                placeholder="Enter phone number"
                                            />
                                        </div>

                                        {/* Address */}
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="address">Address</Label>
                                            <Input
                                                id="address"
                                                value={isEditingProfile ? editedProfile.address : profileData.address}
                                                onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                                                disabled={!isEditingProfile}
                                                placeholder="Enter your address"
                                            />
                                        </div>
                                    </div>

                                    {isEditingProfile && (
                                        <>
                                            <Separator />
                                            <div className="flex justify-end gap-3">
                                                <Button
                                                    variant="outline"
                                                    onClick={handleCancelEdit}
                                                    disabled={updating}
                                                >
                                                    <X className="h-4 w-4 mr-2" />
                                                    Cancel
                                                </Button>
                                                <Button
                                                    onClick={handleProfileUpdate}
                                                    disabled={updating}
                                                >
                                                    <Save className="h-4 w-4 mr-2" />
                                                    {updating ? 'Saving...' : 'Save Changes'}
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Security Tab */}
                        <TabsContent value="security">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Change Password</CardTitle>
                                    <CardDescription>
                                        Update your password to keep your account secure
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        {/* Current Password */}
                                        <div className="space-y-2">
                                            <Label htmlFor="currentPassword">Current Password</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="currentPassword"
                                                    type="password"
                                                    value={passwordData.currentPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                    placeholder="Enter current password"
                                                    className="pl-10"
                                                />
                                            </div>
                                        </div>

                                        {/* New Password */}
                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">New Password</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="newPassword"
                                                    type="password"
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                    placeholder="Enter new password"
                                                    className="pl-10"
                                                />
                                            </div>
                                        </div>

                                        {/* Confirm Password */}
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="confirmPassword"
                                                    type="password"
                                                    value={passwordData.confirmPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                    placeholder="Confirm new password"
                                                    className="pl-10"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-900">
                                        <h4 className="font-semibold text-sm mb-2 text-blue-900 dark:text-blue-100">
                                            Password Requirements:
                                        </h4>
                                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                                            <li>• Minimum 6 characters long</li>
                                            <li>• Must contain letters and numbers</li>
                                            <li>• Avoid using common passwords</li>
                                        </ul>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-end">
                                        <Button
                                            onClick={handlePasswordChange}
                                            disabled={changingPassword}
                                            className="gap-2"
                                        >
                                            <Lock className="h-4 w-4" />
                                            {changingPassword ? 'Changing Password...' : 'Change Password'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Account Info Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Account Information</CardTitle>
                                    <CardDescription>
                                        Details about your account
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between py-2">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">Account Status</p>
                                                <p className="text-sm text-muted-foreground">Active</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                            Active
                                        </Badge>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between py-2">
                                        <div className="flex items-center gap-3">
                                            <Shield className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">Two-Factor Authentication</p>
                                                <p className="text-sm text-muted-foreground">Not enabled</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" disabled>
                                            Coming Soon
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Danger Zone */}
                    <Card className="border-red-200 dark:border-red-900">
                        <CardHeader>
                            <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
                            <CardDescription>
                                Irreversible actions for your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                                        toast({ title: 'Account deletion coming soon!' });
                                    }
                                }}
                            >
                                Delete Account
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
