import { useCallback, useEffect, useState } from "react";

import { httpGetPlanets } from "./requests";

function usePlanets() {
  const [planets, setsavePlanets] = useState([]);

  const getPlanets = useCallback(async () => {
    const fetchedPlanets = await httpGetPlanets();
    // console.log({ fetchedPlanets });
    setsavePlanets(fetchedPlanets);
  }, []);

  useEffect(async () => {
    getPlanets()
  }, [getPlanets]);


  return planets;
}

export default usePlanets;
