import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CompleteProfileDialog({
  open,
  onClose,
}: Props) {
  const [, setLocation] = useLocation();

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-500">
          Please complete your profile before using the dashboard.
        </p>

        <Button
          className="w-full mt-4"
          onClick={() => {
            onClose();
            setLocation("/profile");
          }}
        >
          Complete Profile
        </Button>
      </DialogContent>
    </Dialog>
  );
}