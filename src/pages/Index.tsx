import { useNavigate } from "react-router-dom";
import LandingPage from "@/components/LandingPage";
import { isAuthenticated } from "@/lib/api";
import { ROUTES } from "@/constants/routes";

const Index = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        // Check authentication before proceeding to schema generation
        if (!isAuthenticated()) {
            navigate(ROUTES.LOGIN);
            return;
        }

        // Navigate to dedicated schema generation page
        navigate(ROUTES.SCHEMA_GENERATION);
    };

    return <LandingPage onGetStarted={handleGetStarted} />;
};

export default Index;
