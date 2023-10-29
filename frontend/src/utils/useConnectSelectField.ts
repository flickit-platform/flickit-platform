import { useEffect, useRef, useState } from "react";
import { useServiceContext } from "@providers/ServiceProvider";

/**
 *
 * can be use to fetch select fields options
 * @returns
 */
const useConnectSelectField = (props: {
  url: string;
  searchParams?: Record<string, any>;
  filterOptions?: (options: any[]) => any[];
}) => {
  const {
    url,
    filterOptions = (options) => options,
    searchParams = {},
  } = props;
  const [options, setOptions] = useState<any[]>([]);
  const [defaultOption, setDefaultOption] = useState<any>({});
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
        data: { items, colors, default_color },
      } = await service.fetchOptions({ url }, { signal, params: searchParams });
      if (items) {
        if (Array.isArray(items)) {
          setOptions(items);
          setError(false);
        } else {
          setOptions([]);
          setError(true);
        }
      }
      if (colors && default_color) {
        if (Array.isArray(colors)) {
          setOptions(filterOptions(colors));
          setError(false);
        } else {
          setOptions([]);
          setError(true);
        }
        if (default_color) {
          setDefaultOption(default_color);
          setError(false);
        } else {
          setDefaultOption({});
          setError(true);
        }
      }

      setLoading(false);
    } catch (e) {
      console.error(e);
      setOptions([]);
      setLoading(false);
      setError(true);
    }
  };
  return { options, loading, error, fetchOptions, defaultOption };
};

export default useConnectSelectField;
