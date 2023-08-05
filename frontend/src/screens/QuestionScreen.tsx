import { QuestionContainer } from "@/components/questions/QuestionContainer";
import useDocumentTitle from "@utils/useDocumentTitle";

const QuestionScreen = () => {
  useDocumentTitle();
  return <QuestionContainer />;
};

export default QuestionScreen;
