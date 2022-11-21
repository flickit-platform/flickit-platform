import React from "react";
import { useSearchParams } from "react-router-dom";
import { useServiceContext } from "../../providers/ServiceProvider";
import { useQuery } from "../../utils/useQuery";

const CompareResultContainer = () => {
  const [searchParams] = useSearchParams();
  const assessmentIds = searchParams.getAll("assessmentIds");
  const { service } = useServiceContext();
  const compareResultQueryData = useQuery({
    service: (args = { assessment_list: assessmentIds }, config) =>
      service.compare(args, config),
  });

  return <div>CompareResultContainer</div>;
};

export default CompareResultContainer;
