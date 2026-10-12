import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Edit3,
  Camera,
  CheckCircle2,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MAJOR_CITIES_PAKISTAN } from '../utils/constants';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import Modal from '../components/Modal';

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    city: user?.city || '',
    profileImage: user?.profileImage || '',
    currentPassword: '',
    newPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        phone: user.phone || '',
        city: user.city || '',
        profileImage: user.profileImage || '',
        currentPassword: '',
        newPassword: '',
      });
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSaveSuccess(false);

    try {
      const payload = {
        name: editForm.name.trim(),
        phone: editForm.phone.trim(),
        city: editForm.city.trim(),
        profileImage: editForm.profileImage,
      };

      if (editForm.newPassword) {
        payload.currentPassword = editForm.currentPassword;
        payload.newPassword = editForm.newPassword;
      }

      await updateProfile(payload);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-PK', {
        year: 'numeric',
        month: 'long',
      })
    : 'Recently';

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.name || 'Citizen'
  )}&background=047857&color=fff&bold=true`;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <div className="relative">
          <img
            src={user?.profileImage || defaultAvatar}
            alt={user?.name || 'Profile'}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-emerald-600 shadow-md"
          />
          <button
            onClick={() => setIsEditing(true)}
            className="absolute -bottom-2 -right-2 p-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-xs cursor-pointer transition"
            title="Update photo"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {user?.name || 'Citizen'}
            </h1>
            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{user?.isVerified ? 'Verified Citizen' : 'Registered Citizen'}</span>
            </span>
            {user?.role === 'admin' && (
              <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                Admin
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            {user?.city ? `${user.city}, Pakistan` : 'Pakistan'} • Member since {memberSince}
          </p>
        </div>

        <Button
          variant="outline"
          size="md"
          icon={Edit3}
          onClick={() => setIsEditing(true)}
        >
          Edit Profile
        </Button>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile changes successfully updated in database!</span>
        </div>
      )}

      {/* Account Details Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-900">
            Account Specifications
          </h2>
          <span className="text-[11px] font-mono text-slate-400">
            User ID: {user?._id || user?.id}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 font-medium block mb-1">Full Legal Name</span>
            <span className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-700" />
              {user?.name}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 font-medium block mb-1">Verified Email</span>
            <span className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-700" />
              {user?.email}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 font-medium block mb-1">Registered Phone</span>
            <span className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-700" />
              {user?.phone || 'Not provided'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 font-medium block mb-1">Location / City</span>
            <span className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-700" />
              {user?.city || 'Not provided'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 font-medium block mb-1">Assigned Role</span>
            <span className="text-sm font-semibold text-slate-900 flex items-center gap-2 capitalize">
              <Tag className="w-4 h-4 text-emerald-700" />
              {user?.role || 'user'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 font-medium block mb-1">Account Status</span>
            <span className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              {user?.isActive ? 'Active Citizen Account' : 'Deactivated'}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => {
          setIsEditing(false);
          setErrorMsg('');
        }}
        title="Edit Citizen Profile"
        subtitle="Update your contact details or password"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <Input
            label="Full Name"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            required
          />

          <Input
            label="Phone Number"
            value={editForm.phone}
            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
          />

          <Select
            label="City"
            value={editForm.city}
            onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
            options={MAJOR_CITIES_PAKISTAN.filter((c) => c !== 'All Cities')}
          />

          <Input
            label="Profile Image URL"
            value={editForm.profileImage}
            onChange={(e) => setEditForm({ ...editForm, profileImage: e.target.value })}
            placeholder="https://example.com/photo.jpg"
            helperText="Provide a public image link for your profile avatar."
          />

          <div className="pt-2 border-t border-slate-100 space-y-3">
            <span className="text-xs font-bold text-slate-700 block">
              Change Password (Optional)
            </span>
            <Input
              label="Current Password"
              type="password"
              value={editForm.currentPassword}
              onChange={(e) => setEditForm({ ...editForm, currentPassword: e.target.value })}
              placeholder="Required only if setting new password"
            />
            <Input
              label="New Password"
              type="password"
              value={editForm.newPassword}
              onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
              placeholder="Minimum 6 characters"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button
              variant="outline"
              size="md"
              type="button"
              onClick={() => {
                setIsEditing(false);
                setErrorMsg('');
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
            >
              Save Profile
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
