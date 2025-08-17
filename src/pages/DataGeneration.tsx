import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DataGenerator from "@/components/DataGenerator";
import { isAuthenticated, getSessionToken } from "@/lib/api";
import { ROUTES } from "@/constants/routes";
import Loading from "@/components/ui/loading";

interface SchemaField {
    name: string;
    type: string;
    values?: string[];
}

interface SchemaResponse {
    column_count: number;
    model_used: string;
    schema: SchemaField[];
}

interface DataResponse {
    count: number;
    data: Record<string, any>[];
}

const DataGeneration = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [generatedData, setGeneratedData] = useState<DataResponse | null>(
        null
    );
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // Get schema from navigation state
    const schema = location.state?.schema as SchemaResponse;

    // Persistent form state
    const [dataFormData, setDataFormData] = useState({
        dataRowCount: 10,
        dataModelType: "",
    });

    useEffect(() => {
        // Synchronous auth check
        const token = getSessionToken();
        const authStatus = isAuthenticated();

        console.log("DataGeneration - Auth check:", {
            token: token ? `${token.substring(0, 10)}...` : null,
            authStatus,
            tokenLength: token?.length || 0,
            hasSchema: !!schema,
        });

        if (!authStatus) {
            console.log(
                "DataGeneration - Not authenticated, redirecting to login"
            );
            navigate(ROUTES.LOGIN);
            return;
        }

        if (!schema) {
            console.log(
                "DataGeneration - No schema provided, redirecting to schema generation"
            );
            navigate(ROUTES.SCHEMA_GENERATION);
            return;
        }

        console.log(
            "DataGeneration - Authentication and schema check successful"
        );
        setIsCheckingAuth(false);
    }, [navigate, schema]);

    const handleBackToSchema = () => {
        navigate(ROUTES.SCHEMA_GENERATION);
    };

    const handleDataFormUpdate = (formData: typeof dataFormData) => {
        setDataFormData(formData);
    };

    const handleDataUpdate = (updatedData: DataResponse) => {
        setGeneratedData(updatedData);
    };

    // Show loading while checking authentication
    if (isCheckingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loading size="lg" text="Checking authentication..." />
            </div>
        );
    }

    return (
        <DataGenerator
            schema={schema}
            onBack={handleBackToSchema}
            formData={dataFormData}
            onFormUpdate={handleDataFormUpdate}
            generatedData={generatedData}
            onDataUpdate={handleDataUpdate}
        />
    );
};

export default DataGeneration;
