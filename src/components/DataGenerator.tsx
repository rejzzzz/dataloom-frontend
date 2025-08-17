
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Download, Database, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';



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

interface DataGeneratorProps {
  schema: SchemaResponse;
  onBack: () => void;
  formData: {
    dataRowCount: number;
    dataModelType: string;
  };
  onFormUpdate: (formData: any) => void;
  generatedData: DataResponse | null;
  onDataUpdate: (data: DataResponse) => void;
}

const DataGenerator = ({ schema, onBack, formData, onFormUpdate, generatedData, onDataUpdate }: DataGeneratorProps) => {
  const [isGeneratingData, setIsGeneratingData] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const rowOptions = [
    { value: 10, label: '10 rows' },
    { value: 20, label: '20 rows' },
    { value: 50, label: '50 rows' },
    { value: 100, label: '100 rows' },
    { value: 200, label: '200 rows' },
    { value: 300, label: '300 rows' },
    { value: 400, label: '400 rows' },
    { value: 500, label: '500 rows' }
  ];

  const generateData = async () => {
    if (!formData.dataModelType) {
      setNotification({
        type: 'error',
        message: 'Please select a model type for data generation.'
      });
      return;
    }

    setIsGeneratingData(true);
    setNotification(null);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/generate-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          schema: schema.schema,
          count: formData.dataRowCount,
          model_type: formData.dataModelType
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate data');
      }

      const data: DataResponse = await response.json();
      onDataUpdate(data);
      setNotification({
        type: 'success',
        message: `Successfully generated ${data.count} rows of synthetic data.`
      });
    } catch (error) {
      console.error('Error generating data:', error);
      setNotification({
        type: 'error',
        message: 'Failed to generate data. Please check if the backend is running.'
      });
    } finally {
      setIsGeneratingData(false);
    }
  };

  const downloadData = (format: 'json' | 'csv') => {
    if (!generatedData) return;
    
    let dataStr: string;
    let mimeType: string;
    let fileName: string;

    if (format === 'json') {
      dataStr = JSON.stringify(generatedData.data, null, 2);
      mimeType = 'application/json';
      fileName = 'synthetic-data.json';
    } else {
      // Convert to CSV
      const headers = Object.keys(generatedData.data[0]);
      const csvRows = [
        headers.join(','),
        ...generatedData.data.map(row => 
          headers.map(header => {
            const value = row[header];
            // Escape quotes and wrap in quotes if contains comma
            const stringValue = String(value);
            return stringValue.includes(',') ? `"${stringValue.replace(/"/g, '""')}"` : stringValue;
          }).join(',')
        )
      ];
      dataStr = csvRows.join('\n');
      mimeType = 'text/csv';
      fileName = 'synthetic-data.csv';
    }
    
    const dataBlob = new Blob([dataStr], { type: mimeType });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setNotification({
      type: 'success',
      message: `Your ${format.toUpperCase()} file is being downloaded.`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between py-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2"
            disabled={isGeneratingData}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Schema
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mt-12">Data Generator</h1>
            <p className="text-gray-600">Step 2: Generate synthetic data</p>
          </div>
          <div className="w-32" /> {/* Spacer for centering */}
        </div>

        {/* Loading Overlay */}
        {isGeneratingData && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8 text-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Generating Synthetic Data</h3>
                  <p className="text-muted-foreground">Please wait for a few minutes...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Inline Notification */}
        {notification && (
          <Alert className={`animate-fade-in ${notification.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
            {notification.type === 'error' ? (
              <AlertCircle className="h-4 w-4 text-red-600" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-600" />
            )}
            <AlertDescription className={notification.type === 'error' ? 'text-red-800' : 'text-green-800'}>
              {notification.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Schema Summary */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Using Schema
              <Badge variant="secondary">{schema.model_used}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {schema.schema.map((field, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {field.name} ({field.type})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Generation Controls */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              Generate Synthetic Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dataModel">AI Model for Data Generation</Label>
                <Select 
                  value={formData.dataModelType} 
                  onValueChange={(value) => onFormUpdate({ ...formData, dataModelType: value })}
                  disabled={isGeneratingData}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mistral">🚀 Mistral</SelectItem>
                    <SelectItem value="claude">🧠 Claude</SelectItem>
                    <SelectItem value="llama">🦙 Llama</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rows">Number of Rows</Label>
                <Select 
                  value={formData.dataRowCount.toString()} 
                  onValueChange={(value) => onFormUpdate({ ...formData, dataRowCount: parseInt(value) })}
                  disabled={isGeneratingData}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of rows" />
                  </SelectTrigger>
                  <SelectContent>
                    {rowOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={generateData} 
                disabled={isGeneratingData}
                size="lg"
                className="px-8"
              >
                {isGeneratingData ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Data...
                  </>
                ) : (
                  'Generate Synthetic Data'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Generated Data Display */}
        {generatedData && (
          <Card className="shadow-lg border-0 animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                Generated Data ({generatedData.count} rows)
              </CardTitle>
              <div className="flex gap-2">
                <Button 
                  onClick={() => downloadData('csv')} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                  disabled={isGeneratingData}
                >
                  <Download className="w-4 h-4" />
                  Download CSV
                </Button>
                <Button 
                  onClick={() => downloadData('json')} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                  disabled={isGeneratingData}
                >
                  <Download className="w-4 h-4" />
                  Download JSON
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-auto max-h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {generatedData.data.length > 0 && Object.keys(generatedData.data[0]).map((key) => (
                        <TableHead key={key} className="whitespace-nowrap font-semibold">{key}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {generatedData.data.map((row, index) => (
                      <TableRow key={index} className="hover:bg-muted/50">
                        {Object.values(row).map((value, cellIndex) => (
                          <TableCell key={cellIndex} className="whitespace-nowrap">
                            {typeof value === 'boolean' ? (
                              <Badge variant={value ? "default" : "secondary"}>
                                {value.toString()}
                              </Badge>
                            ) : (
                              String(value)
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DataGenerator;
