import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  isConfirmDisabled?: boolean;
  children?: React.ReactNode;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  isLoading = false,
  isConfirmDisabled = false,
  children,
}) => {
  const getColorClasses = () => {
    switch (type) {
      case 'danger': return 'text-danger bg-danger/10';
      case 'warning': return 'text-warning bg-warning/10';
      default: return 'text-primary bg-primary/10';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getColorClasses()}`}>
          <AlertTriangle size={32} />
        </div>
        <div>
          <p className="text-slate-400">{message}</p>
        </div>
        {children && (
          <div className="w-full text-left mt-4">
            {children}
          </div>
        )}
        <div className="flex items-center space-x-3 w-full mt-6">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant="primary"
            className={`flex-1 ${type === 'danger' ? 'bg-danger hover:bg-danger/90' : ''}`}
            onClick={onConfirm}
            isLoading={isLoading}
            disabled={isLoading || isConfirmDisabled}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
