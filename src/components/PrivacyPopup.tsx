
import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PrivacyPopupProps {
  formName: string;
}

const PrivacyPopup: React.FC<PrivacyPopupProps> = ({ formName }) => {
  const [open, setOpen] = useState(false);
  const popupKey = `privacy-popup-shown-${formName}`;
  
  useEffect(() => {
    // Check if this popup has been shown before
    const hasShown = localStorage.getItem(popupKey);
    if (!hasShown) {
      setOpen(true);
      // Mark as shown
      localStorage.setItem(popupKey, 'true');
    }
  }, [popupKey]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center">
          <Lock className="h-12 w-12 text-finbaba-text mb-4" />
          <DialogTitle className="text-center font-cormorant text-xl text-finbaba-text">Your Data is Protected</DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <p className="text-center font-raleway text-finbaba-text">
            Your data is protected with us and we do not share it with any third party organization. Your results are only used for your personal analysis.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPopup;
