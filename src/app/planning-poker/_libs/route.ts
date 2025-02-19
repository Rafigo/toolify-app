export const getPlanningPokerRouteBySegment = (pathname: string) => {
  switch (pathname) {
    case "":
      return "";
    case "planning-poker":
    case "admin":
    case "edition":
      return "/planning-poker/admin/dashboard";
    default:
      return "";
  }
};
