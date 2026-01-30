
import React from 'react';

// FIX: Removed conflicting global declaration for window.aistudio.
// The execution environment is expected to provide this type definition.
// The component already performs runtime checks for its existence.

interface ApiKeySelectorProps {
    onKeySelected: () => void;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {

    const handleSelectKey = async () => {
        if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
            await window.aistudio.openSelectKey();
            // Assume selection is successful and proceed.
            // App component will re-verify on next API call failure.
            onKeySelected();
        } else {
            alert("API key selection is not available in this environment.");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-slate-100 font-sans">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                <div className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 text-3xl font-bold mb-4">
                    A
                </div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Aiveno Image Generation</h1>
                <p className="text-slate-600 mb-4">
                    To use the creative image and poster generator, you need to select an API key from a paid cloud project.
                </p>
                <p className="text-xs text-slate-500 mb-6">
                    This feature uses advanced models. Please ensure your project has billing enabled.
                    You can find more information about billing at{' '}
                    <a
                        href="https://ai.google.dev/gemini-api/docs/billing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:underline"
                    >
                        ai.google.dev/gemini-api/docs/billing
                    </a>.
                </p>
                <button
                    onClick={handleSelectKey}
                    className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-200"
                >
                    Select API Key
                </button>
            </div>
        </div>
    );
};

export default ApiKeySelector;
