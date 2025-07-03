import { createContext } from "react";

export const InterviewDataContext = createContext();

export const InterviewDataProvider = ({ children }) => {
    const [interviewData, setInterviewData] = useState(null);
    return (
        <InterviewDataContext.Provider value={{ interviewData, setInterviewData }}>
            {children}
        </InterviewDataContext.Provider>
    )
}