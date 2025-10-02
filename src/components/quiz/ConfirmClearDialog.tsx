import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ConfirmClearDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmClearDialog({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmClearDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Clear All History
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete all quiz history? This action cannot
            be undone.
            <br />
            <br />
            This will permanently remove all your past quiz sessions, scores,
            and progress data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Clear All History
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
