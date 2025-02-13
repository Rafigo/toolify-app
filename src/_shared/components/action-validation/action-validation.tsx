"use client";

import { Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";

interface ActionvalidationProps {
  mainTitle: string;
  mainDescription: string;
  mainActionLabel: string;
  mainIcon: React.ReactElement;
  onValidate: () => void;
}

export default function Actionvalidation({
  mainTitle,
  mainDescription,
  mainActionLabel,
  mainIcon,
  onValidate,
}: ActionvalidationProps) {
  const [open, setOpen] = useState(false);

  const validateDelete = () => {
    onValidate();
  };

  const toggleDialog = () => {
    setOpen(!open);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button title={mainActionLabel} variant="ghost">
          {mainIcon}
          {mainActionLabel && <>&nbsp;{mainActionLabel}</>}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mainTitle}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <p className="text-sm font">{mainDescription}</p>
          <div className="grid grid-cols-5 gap-4 w-full">
            <Button
              type="button"
              title="Annuler l'action"
              className="col-span-2"
              onClick={toggleDialog}
              variant="ghost"
            >
              <X />
              &nbsp; Annuler
            </Button>
            <Button
              type="button"
              title="Valider l'action"
              className="col-span-3"
              onClick={validateDelete}
            >
              <Check />
              &nbsp; Valider
            </Button>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          {/* {(isError || isPending || isSuccess) && (
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
                  "Création du planning poker en cours, merci de patienter quelques instants."}
                {isError && "La création du planning poker a échoué."}
                {isSuccess && "Le planning poker a été créé avec succès."}
              </AlertDescription>
            </Alert>
          )} */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
