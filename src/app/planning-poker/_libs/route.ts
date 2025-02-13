export const getPlanningPokerRouteBySegment = (pathname: string) => {
  switch (pathname) {
    case "":
      return "";
    case "planning-poker":
    case "admin":
      return "/planning-poker/admin/dashboard";
    case "edition":
      return "/planning-poker/admin/edition";
    default:
      return "";
  }
};
