import { useEffect, useRef, useState } from "react";
import { useServiceContext } from "../providers/ServiceProvider";

const useConnectSelectField = (props: {
  url: string;
  filterOptions?: (options: any[]) => any[];
}) => {
  const { url, filterOptions = (options) => options } = props;
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const { service } = useServiceContext();

  useEffect(() => {
    const controller = new AbortController();
    fetchOptions(controller.signal);

    return () => {
      controller.abort();
    };
  }, []);

  const fetchOptions = async (signal: AbortSignal) => {
    setLoading(true);
    try {
      const {
        data: { results },
      } = await service.fetchOptions({ url }, { signal });

      if (results && Array.isArray(results)) {
        setOptions(filterOptions(results));
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
