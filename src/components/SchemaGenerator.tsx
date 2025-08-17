import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Loader2,
    Database,
    FileCode,
    ArrowLeft,
    ArrowRight,
    Sparkles,
    Zap,
    CheckCircle,
    AlertCircle,
    Edit,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    generateSchema as apiGenerateSchema,
    updateRequestCount,
    getRemainingRequests,
} from "@/lib/api";

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

interface SchemaGeneratorProps {
    onSchemaGenerated: (schema: SchemaResponse) => void;
    onBack: () => void;
    formData: {
        description: string;
        modelType: string;
        columnCount: number;
    };
    onFormUpdate: (formData: any) => void;
    schema: SchemaResponse | null;
    onSchemaUpdate: (schema: SchemaResponse) => void;
}

const SchemaGenerator = ({
    onSchemaGenerated,
    onBack,
    formData,
    onFormUpdate,
    schema,
    onSchemaUpdate,
}: SchemaGeneratorProps) => {
    const [isGeneratingSchema, setIsGeneratingSchema] = useState(false);
    const [notification, setNotification] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);
    const [jsonError, setJsonError] = useState<string>("");
    const [editableJson, setEditableJson] = useState<string>("");
    const [remainingRequests, setRemainingRequests] = useState<number>(10);

    useEffect(() => {
        // Update remaining requests count
        setRemainingRequests(getRemainingRequests());

        if (schema) {
            setEditableJson(JSON.stringify(schema, null, 2));
        }
    }, [schema]);

    const generateSchema = async () => {
        if (!formData.description.trim() || !formData.modelType) {
            setNotification({
                type: "error",
                message:
                    "Please provide a description and select a model type.",
            });
            return;
        }

        setIsGeneratingSchema(true);
        setNotification(null);

        try {
            const data: SchemaResponse = await apiGenerateSchema(
                formData.description,
                formData.modelType,
                formData.columnCount
            );

            onSchemaUpdate(data);

            // Update request count and show warning if needed
            const warningMessage = updateRequestCount();
            const successMessage = `Successfully generated schema with ${data.column_count} columns using ${data.model_used}.`;

            setNotification({
                type: "success",
                message: warningMessage
                    ? `${successMessage} ${warningMessage}`
                    : successMessage,
            });

            // Update remaining requests display
            setRemainingRequests(getRemainingRequests());
        } catch (error: any) {
            console.error("Error generating schema:", error);

            if (error.message.includes("Rate limit exceeded")) {
                setNotification({
                    type: "error",
                    message: error.message,
                });
            } else {
                setNotification({
                    type: "error",
                    message:
                        error.message ||
                        "Failed to generate schema. Please try again.",
                });
            }
        } finally {
            setIsGeneratingSchema(false);
        }
    };

    const handleJsonEdit = (value: string) => {
        setEditableJson(value);
        setJsonError("");

        try {
            const parsed = JSON.parse(value);

            // Validate the structure
            if (
                parsed.schema &&
                Array.isArray(parsed.schema) &&
                parsed.column_count &&
                parsed.model_used
            ) {
                onSchemaUpdate(parsed);
            } else {
                setJsonError("Invalid schema structure");
            }
        } catch (error) {
            setJsonError("Invalid JSON format");
        }
    };

    const handleProceedToDataGeneration = () => {
        if (schema) {
            onSchemaGenerated(schema);
        }
    };

    const modelOptions = [
        { value: "mistral", label: "Mistral", icon: "🚀" },
        { value: "claude", label: "Claude", icon: "🧠" },
        { value: "llama", label: "Llama", icon: "🦙" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="max-w-6xl mx-auto p-6 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between py-8">
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="flex items-center gap-2 hover:bg-white/50 transition-all duration-200"
                        disabled={isGeneratingSchema}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Button>
                    <div className="text-center">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mt-12">
                            Schema Generator
                        </h1>
                        <p className="text-lg text-muted-foreground mt-2">
                            Step 1: Define your dataset structure
                        </p>
                    </div>
                    <div className="w-24" />
                </div>

                {/* Loading Overlay */}
                {isGeneratingSchema && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                            <CardContent className="p-8 text-center space-y-4">
                                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold">
                                        Generating Schema
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Please wait for a few seconds...
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Inline Notification */}
                {notification && (
                    <Alert
                        className={`animate-fade-in ${
                            notification.type === "error"
                                ? "border-red-200 bg-red-50"
                                : "border-green-200 bg-green-50"
                        }`}
                    >
                        {notification.type === "error" ? (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                        ) : (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                        <AlertDescription
                            className={
                                notification.type === "error"
                                    ? "text-red-800"
                                    : "text-green-800"
                            }
                        >
                            {notification.message}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Schema Generation Form */}
                <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm animate-fade-in">
                    <CardHeader className="text-center pb-6">
                        <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                            <div className="p-2 bg-primary/10 rounded-full">
                                <Database className="w-6 h-6 text-primary" />
                            </div>
                            Generate Your Schema
                        </CardTitle>
                        <p className="text-muted-foreground">
                            Describe your dataset and let AI create the perfect
                            structure
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm">
                            <Badge variant="outline" className="text-xs">
                                {remainingRequests} requests remaining today
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="space-y-3">
                                <Label
                                    htmlFor="description"
                                    className="text-base font-medium"
                                >
                                    Dataset Description
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="e.g., a dataset of medical records with patient information, diagnoses, and treatments..."
                                    value={formData.description}
                                    onChange={(e) =>
                                        onFormUpdate({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    className="min-h-[120px] resize-none border-2 focus:border-primary/50 transition-colors"
                                    disabled={isGeneratingSchema}
                                />
                            </div>

                            <div className="space-y-3">
                                <Label
                                    htmlFor="model"
                                    className="text-base font-medium"
                                >
                                    AI Model
                                </Label>
                                <Select
                                    value={formData.modelType}
                                    onValueChange={(value) =>
                                        onFormUpdate({
                                            ...formData,
                                            modelType: value,
                                        })
                                    }
                                    disabled={isGeneratingSchema}
                                >
                                    <SelectTrigger className="border-2 focus:border-primary/50 transition-colors">
                                        <SelectValue placeholder="Choose your AI model" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {modelOptions.map((model) => (
                                            <SelectItem
                                                key={model.value}
                                                value={model.value}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span>{model.icon}</span>
                                                    <span>{model.label}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {formData.modelType && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Zap className="w-4 h-4" />
                                        <span>
                                            Using{" "}
                                            {
                                                modelOptions.find(
                                                    (m) =>
                                                        m.value ===
                                                        formData.modelType
                                                )?.label
                                            }{" "}
                                            for generation
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <Label
                                    htmlFor="columns"
                                    className="text-base font-medium"
                                >
                                    Number of Columns
                                </Label>
                                <Input
                                    id="columns"
                                    type="number"
                                    min="1"
                                    max="15"
                                    value={formData.columnCount}
                                    onChange={(e) =>
                                        onFormUpdate({
                                            ...formData,
                                            columnCount: Math.min(
                                                15,
                                                Math.max(
                                                    1,
                                                    parseInt(e.target.value) ||
                                                        5
                                                )
                                            ),
                                        })
                                    }
                                    className="border-2 focus:border-primary/50 transition-colors"
                                    disabled={isGeneratingSchema}
                                />
                                <p className="text-sm text-muted-foreground">
                                    Maximum: 15 columns (Recommended: 5-10)
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-center pt-4">
                            <Button
                                onClick={generateSchema}
                                disabled={
                                    isGeneratingSchema ||
                                    !formData.description.trim() ||
                                    !formData.modelType
                                }
                                size="lg"
                                className="px-12 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                                {isGeneratingSchema ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Generating Schema...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5 mr-2" />
                                        Generate Schema
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Schema Display */}
                {schema && (
                    <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm animate-fade-in">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-full">
                                    <FileCode className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">
                                        Generated Schema
                                    </CardTitle>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge
                                            variant="secondary"
                                            className="text-sm"
                                        >
                                            {schema.model_used}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="text-sm"
                                        >
                                            {schema.column_count} columns
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <Button
                                onClick={handleProceedToDataGeneration}
                                size="lg"
                                className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                disabled={isGeneratingSchema}
                            >
                                Generate Data
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="table" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-6">
                                    <TabsTrigger
                                        value="table"
                                        className="flex items-center gap-2"
                                    >
                                        <Database className="w-4 h-4" />
                                        Table View
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="json"
                                        className="flex items-center gap-2"
                                    >
                                        <Edit className="w-4 h-4" />
                                        JSON Editor
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="table" className="mt-6">
                                    <div className="border rounded-xl overflow-hidden shadow-sm bg-white">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-50">
                                                    <TableHead className="font-semibold">
                                                        Field Name
                                                    </TableHead>
                                                    <TableHead className="font-semibold">
                                                        Data Type
                                                    </TableHead>
                                                    <TableHead className="font-semibold">
                                                        Possible Values
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {schema.schema.map(
                                                    (field, index) => (
                                                        <TableRow
                                                            key={index}
                                                            className="hover:bg-gray-50/50 transition-colors"
                                                        >
                                                            <TableCell className="font-medium text-primary">
                                                                {field.name}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    variant="outline"
                                                                    className="capitalize"
                                                                >
                                                                    {field.type}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                {field.values ? (
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {field.values
                                                                            .slice(
                                                                                0,
                                                                                3
                                                                            )
                                                                            .map(
                                                                                (
                                                                                    value,
                                                                                    i
                                                                                ) => (
                                                                                    <Badge
                                                                                        key={
                                                                                            i
                                                                                        }
                                                                                        variant="secondary"
                                                                                        className="text-xs"
                                                                                    >
                                                                                        {
                                                                                            value
                                                                                        }
                                                                                    </Badge>
                                                                                )
                                                                            )}
                                                                        {field
                                                                            .values
                                                                            .length >
                                                                            3 && (
                                                                            <Badge
                                                                                variant="secondary"
                                                                                className="text-xs"
                                                                            >
                                                                                +
                                                                                {field
                                                                                    .values
                                                                                    .length -
                                                                                    3}{" "}
                                                                                more
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-muted-foreground italic">
                                                                        Auto-generated
                                                                    </span>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </TabsContent>

                                <TabsContent value="json" className="mt-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Edit className="w-4 h-4" />
                                            <span>
                                                Edit the JSON below to customize
                                                your schema. Changes will update
                                                the table view in real-time.
                                            </span>
                                        </div>
                                        {jsonError && (
                                            <Alert className="border-red-200 bg-red-50">
                                                <AlertCircle className="h-4 w-4 text-red-600" />
                                                <AlertDescription className="text-red-800">
                                                    {jsonError}
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                        <Textarea
                                            value={editableJson}
                                            onChange={(e) =>
                                                handleJsonEdit(e.target.value)
                                            }
                                            className="min-h-[400px] font-mono text-sm border-2 focus:border-primary/50 transition-colors"
                                            placeholder="Edit your schema JSON here..."
                                            disabled={isGeneratingSchema}
                                        />
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default SchemaGenerator;
