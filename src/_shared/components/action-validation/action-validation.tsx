"use client";

import { Ban, Check, RefreshCcw, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { forwardRef, useState, useImperativeHandle } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export type ChildDialogRef = {
  open: () => void;
  close: () => void;
};

interface ActionvalidationProps {
  title: React.ReactElement;
  description: React.ReactElement;
  buttonTitle: string;
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
  onValidate: () => void;
  onClose?: () => void;
  icon?: React.ReactElement;
  buttonLabel?: string;
}

const Actionvalidation = forwardRef<ChildDialogRef, ActionvalidationProps>(
  (
    {
      title,
      description,
      buttonLabel,
      buttonTitle,
      icon,
      onValidate,
      isPending,
      isError,
      isSuccess,
      onClose,
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);

    // Exposer les méthodes `open` et `close` au parent via la ref
    useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
    }));

    const validateDelete = () => {
      onValidate();
    };

    const toggleDialog = () => {
      setOpen(!open);
    };

    const closeDialog = () => {
      if (onClose) {
        onClose();
      }
      toggleDialog();
    };

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <Button title={buttonTitle} variant="ghost" onClick={toggleDialog}>
          {icon && icon}
          {buttonLabel && buttonLabel !== "" && <>&nbsp;{buttonLabel}</>}
        </Button>
        <DialogContent
          className="sm:max-w-md"
          aria-describedby="Fenêtre de validation d'action"
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="text-sm font">{description}</div>
            {!isSuccess && (
              <div className="flex gap-4 w-full justify-center">
                <Button
                  type="button"
                  title="Annuler l'action"
                  onClick={closeDialog}
                  variant="ghost"
                  disabled={isPending}
                >
                  <X />
                  &nbsp; Annuler
                </Button>
                <Button
                  type="button"
                  title="Valider l'action"
                  onClick={validateDelete}
                  disabled={isPending}
                >
                  <Check />
                  &nbsp; Valider
                </Button>
              </div>
            )}
          </div>
          <DialogFooter className="sm:justify-start">
            {(isError || isPending || isSuccess) && (
              <Alert variant={isError ? "destructive" : "default"}>
                {isPending && <RefreshCcw className="h-4 w-4" />}
                {isError && <Ban className="h-4 w-4" />}
                {isSuccess && <Check className="h-4 w-4" />}
                <AlertTitle>
                  {isPending && "Traitement en cours"}
                  {isError && "Echec"}
                  {isSuccess && "Succès"}
                </AlertTitle>
                <AlertDescription>
                  {isPending &&
                    "Suppression du planning poker en cours, merci de patienter quelques instants."}
                  {isError && "La suppression du planning poker a échoué."}
                  {isSuccess && "Le planning poker a été supprimé avec succès."}
                </AlertDescription>
              </Alert>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

Actionvalidation.displayName = "Actionvalidation";
export default Actionvalidation;
