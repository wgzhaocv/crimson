import { useState } from "react";

export const useDialogState = (
  controlledOpen?: boolean,
  onOpenChange?: (open: boolean) => void,
) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange! : setInternalOpen;

  return { open, setOpen };
};
