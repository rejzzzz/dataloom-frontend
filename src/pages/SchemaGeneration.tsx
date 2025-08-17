import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SchemaGenerator from "@/components/SchemaGenerator";
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

const SchemaGeneration = () => {
    const navigate = useNavigate();
    const [generatedSchema, setGeneratedSchema] =
        useState<SchemaResponse | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // Persistent form state
    const [schemaFormData, setSchemaFormData] = useState({
        description: "",
        modelType: "",
        columnCount: 5,
    });

    useEffect(() => {
        // Check authentication on page load with debugging
        const checkAuthentication = () => {
            const token = getSessionToken();
            const authStatus = isAuthenticated();

            console.log("SchemaGeneration - Auth check:", {
                token: token ? `${token.substring(0, 10)}...` : null,
                authStatus,
                tokenLength: token?.length || 0,
            });

            // console.log("isAuthenticated:", isAuthenticated());
            if (!authStatus) {
                console.log(
                    "SchemaGeneration - Not authenticated, redirecting to login"
                );
                navigate(ROUTES.LOGIN);
                return;
            }

            console.log("SchemaGeneration - Authentication successful");
            setIsCheckingAuth(false);
        };
        checkAuthentication();
    }, [navigate]);

    const handleSchemaGenerated = (schema: SchemaResponse) => {
        setGeneratedSchema(schema);
        // Navigate to data generation page with the schema
        navigate(ROUTES.DATA_GENERATION, { state: { schema } });
    };

    const handleBackToHome = () => {
        navigate(ROUTES.HOME);
    };

    const handleSchemaFormUpdate = (formData: typeof schemaFormData) => {
        setSchemaFormData(formData);
    };

    const handleSchemaUpdate = (updatedSchema: SchemaResponse) => {
        setGeneratedSchema(updatedSchema);
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
        <SchemaGenerator
            onSchemaGenerated={handleSchemaGenerated}
            onBack={handleBackToHome}
            formData={schemaFormData}
            onFormUpdate={handleSchemaFormUpdate}
            schema={generatedSchema}
            onSchemaUpdate={handleSchemaUpdate}
        />
    );
};

export default SchemaGeneration;
