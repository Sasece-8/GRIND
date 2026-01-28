import { useState } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import api from '../lib/axios';

const AddLectureModal = ({ isOpen, onClose, sectionId, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [isPreviewFree, setIsPreviewFree] = useState(false);
    const [videoFile, setVideoFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (videoFile && videoFile.size > 100 * 1024 * 1024) {
            setError('File size exceeds 100MB limit. Please upload a smaller video.');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('isPreviewFree', isPreviewFree);
            if (videoFile) {
                formData.append('video', videoFile);
            }

            // Using axios onUploadProgress for progress bar
            await api.post(`/lecture/${sectionId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });

            onSuccess();
            onClose();
            // Reset form
            setTitle('');
            setIsPreviewFree(false);
            setVideoFile(null);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to upload lecture');
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Add New Lecture</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Lecture Title
                        </label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            placeholder="e.g., Introduction to React"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="preview"
                            checked={isPreviewFree}
                            onChange={(e) => setIsPreviewFree(e.target.checked)}
                            className="rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <label htmlFor="preview" className="text-sm text-gray-700">
                            Allow Free Preview
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Video File
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer relative">
                            <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => setVideoFile(e.target.files[0])}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {videoFile ? (
                                <div className="text-emerald-600 font-medium flex items-center justify-center gap-2">
                                    <Upload size={20} />
                                    {videoFile.name}
                                </div>
                            ) : (
                                <div className="text-gray-500">
                                    <Upload className="mx-auto mb-2" size={24} />
                                    <span className="text-sm">Click to upload video</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {loading && (
                        <div className="space-y-2">
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-emerald-500 transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            <p className="text-xs text-center text-gray-500">
                                Uploading... {uploadProgress}%
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader className="animate-spin" size={20} /> : 'Save Lecture'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddLectureModal;
