import { useEffect, useRef, useState } from "react";
import { useServiceContext } from "../providers/ServiceProvider";

const useConnectSelectField = (url: any) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const { service } = useServiceContext();

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    setLoading(true);
    try {
      const {
        data: { results },
      } = await service.fetchOptions(url);

      if (results) {
        setOptions(results);
        setError(false);
      } else {
        setOptions([]);
        setError(true);
      }

      setLoading(false);
    } catch (e) {
      console.error(e);
      setOptions([]);
      setLoading(false);
      setError(true);
    }
  };

  return { options, loading, error, fetchOptions };
};

export default useConnectSelectField;
