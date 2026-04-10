"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger,  DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

type Props = {
  userName: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteDialog({ userName, open, onClose, onConfirm }: Props) {
  

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete user?</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <p>
            This will delete user <strong>{userName}</strong>.
          </p>
        </div>
        <DialogFooter>
          <Button  className="bg-black text-white hover:bg-zinc-800" onClick={onClose}>
            No
          </Button>
          <Button className="bg-red-600 text-white" onClick={onConfirm}>
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}