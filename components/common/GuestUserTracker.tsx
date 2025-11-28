import { trackGuestSession } from "@/lib/guest";

const GuestUserTracker = async () => {
  await trackGuestSession();
  return null;
};

export default GuestUserTracker;
