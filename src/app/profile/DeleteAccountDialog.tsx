"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { DeleteAccountConfirm } from "./DeleteAccountConfirm";

interface DeleteAccountDialogProps {
  email: string;
}

export function DeleteAccountDialog({ email }: DeleteAccountDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button type="button" variant="destructive" />}>
        Delete account
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete account</DialogTitle>
          <DialogDescription>
            This permanently deletes your account and all of its items,
            collections, and tags. This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DeleteAccountConfirm
          email={email}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
