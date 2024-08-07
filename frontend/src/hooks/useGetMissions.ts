import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export interface Mission {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  completed: boolean;
}

const fetchMissions = async (walletAddress: string): Promise<Mission[]> => {
  const url = `${process.env.REACT_APP_BACKEND_URL}/api/missions/${walletAddress}`;
  const response = await axios.get(url);
  return response.data;
};

const useGetMissions = (walletAddress: string) => {
  return useQuery({
    queryKey: ["missions", walletAddress],
    queryFn: () => fetchMissions(walletAddress),
  });
};

export default useGetMissions;
