import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Download, 
  ArrowLeft,
  Car,
  Camera,
  ClipboardList,
  Shield,
  Package,
  Users,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { STAGE_LABELS, INSURANCE_LABELS } from '@/types/case';

export default function Documentation() {
  const navigate = useNavigate();

  const handleExportPDF = () => {
    window.print();
  };

  const stages = [
    { key: 'new-intake', description: 'New vehicle arrives at the service center. Basic customer and vehicle details are captured.' },
    { key: 'damage-assessment', description: 'Technician inspects the vehicle and documents all damage with photos and notes.' },
    { key: 'repair-in-progress', description: 'Vehicle is being repaired. Parts are ordered and work is ongoing.' },
    { key: 'insurance-claim', description: 'Insurance documentation and claims are being processed.' },
    { key: 'ready-for-delivery', description: 'Repairs complete. Vehicle is ready for customer pickup.' },
    { key: 'case-closed', description: 'Vehicle delivered to customer. Case is archived.' },
  ];

  const insuranceStages = [
    { key: 'not-applied', color: 'bg-muted', description: 'Customer has not applied for insurance claim' },
    { key: 'applied', color: 'bg-blue-500', description: 'Insurance claim application submitted' },
    { key: 'inspector-scheduled', color: 'bg-purple-500', description: 'Insurance inspector visit has been scheduled' },
    { key: 'inspected', color: 'bg-indigo-500', description: 'Inspector has completed the vehicle inspection' },
    { key: 'under-review', color: 'bg-yellow-500', description: 'Insurance company is reviewing the claim' },
    { key: 'approved', color: 'bg-green-500', description: 'Claim approved - proceed with repairs' },
    { key: 'rejected', color: 'bg-red-500', description: 'Claim rejected - inform customer' },
    { key: 'not-applicable', color: 'bg-muted', description: 'No insurance claim for this case' },
  ];

  const partsStages = [
    { key: 'Not Ordered', color: 'bg-muted', description: 'Parts requirements not yet identified' },
    { key: 'Ordered', color: 'bg-yellow-500', description: 'Parts have been ordered from suppliers' },
    { key: 'Arrived', color: 'bg-green-500', description: 'All parts received and ready for installation' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Hidden in print */}
      <header className="print:hidden sticky top-0 z-10 bg-background border-b px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Button onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export as PDF
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6 space-y-8 print:p-0">
        {/* Title Page */}
        <div className="text-center py-8 print:py-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <FileText className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">ServiceDesk</h1>
          <p className="text-xl text-muted-foreground mb-4">
            Vehicle Repair Case Management System
          </p>
          <p className="text-sm text-muted-foreground">
            Documentation & User Guide
          </p>
        </div>

        <Separator className="print:hidden" />

        {/* Overview */}
        <Card className="print:shadow-none print:border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              System Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              ServiceDesk is a mobile-first application designed for Mahindra service advisors 
              to track accidental vehicle repairs. It prevents information loss when handling 
              multiple customers simultaneously by providing a structured workflow and 
              comprehensive case tracking.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-secondary rounded-lg">
                <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Customer Management</p>
              </div>
              <div className="text-center p-4 bg-secondary rounded-lg">
                <Car className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Vehicle Tracking</p>
              </div>
              <div className="text-center p-4 bg-secondary rounded-lg">
                <Camera className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Photo Documentation</p>
              </div>
              <div className="text-center p-4 bg-secondary rounded-lg">
                <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Insurance Workflow</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kanban Workflow */}
        <Card className="print:shadow-none print:border-0 print:break-before-page">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              Kanban Pipeline Stages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Cases move through 6 stages from intake to closure. Each stage represents 
              a key milestone in the repair process.
            </p>
            <div className="space-y-4">
              {stages.map((stage, index) => (
                <div key={stage.key} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    {index < stages.length - 1 && (
                      <div className="w-0.5 h-8 bg-border mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <h4 className="font-semibold">{STAGE_LABELS[stage.key as keyof typeof STAGE_LABELS]}</h4>
                    <p className="text-sm text-muted-foreground">{stage.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insurance Workflow */}
        <Card className="print:shadow-none print:border-0 print:break-before-page">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Insurance Claim Workflow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Track insurance claims through the complete lifecycle from application to approval.
              After vehicle damage inspection, the insurance inspector also inspects before the claim process begins.
            </p>
            <div className="space-y-3">
              {insuranceStages.map((stage, index) => (
                <div key={stage.key} className="flex items-center gap-3">
                  <Badge className={`${stage.color} text-white min-w-[140px] justify-center`}>
                    {INSURANCE_LABELS[stage.key as keyof typeof INSURANCE_LABELS]}
                  </Badge>
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 print:hidden" />
                  <span className="text-sm text-muted-foreground">{stage.description}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Insurance Process Flow
              </h5>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700 dark:text-blue-300">
                <li>Customer applies for insurance claim → Status: <strong>Applied</strong></li>
                <li>Schedule insurance inspector visit → Status: <strong>Inspector Scheduled</strong></li>
                <li>Inspector completes vehicle inspection → Status: <strong>Inspected</strong></li>
                <li>Insurance company reviews documentation → Status: <strong>Under Review</strong></li>
                <li>Final decision received → Status: <strong>Approved</strong> or <strong>Rejected</strong></li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Parts Tracking */}
        <Card className="print:shadow-none print:border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Parts Status Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Track parts ordering and delivery status for each case.
            </p>
            <div className="space-y-3">
              {partsStages.map((stage) => (
                <div key={stage.key} className="flex items-center gap-3">
                  <Badge className={`${stage.color} text-white min-w-[100px] justify-center`}>
                    {stage.key}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{stage.description}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Photo Management */}
        <Card className="print:shadow-none print:border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              Photo Documentation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Capture and manage damage photos for comprehensive documentation.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Capture photos directly from camera</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Select multiple images from gallery</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Automatic image compression for storage efficiency</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Full-screen photo viewing with zoom</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Download photos for sharing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Optional photo upload during case creation</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Case Card Features */}
        <Card className="print:shadow-none print:border-0 print:break-before-page">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5 text-primary" />
              Case Management Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h5 className="font-semibold mb-2">Customer Information</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Customer name</li>
                  <li>• Phone number (tap to call)</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h5 className="font-semibold mb-2">Vehicle Details</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Vehicle model (preset or custom)</li>
                  <li>• Vehicle color (preset or custom)</li>
                  <li>• Registration number</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h5 className="font-semibold mb-2">Damage Documentation</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Damage description</li>
                  <li>• Photo attachments</li>
                  <li>• Timestamped notes</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h5 className="font-semibold mb-2">Priority Management</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Normal priority (default)</li>
                  <li>• Urgent priority (highlighted)</li>
                  <li>• Toggle priority anytime</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 text-muted-foreground text-sm print:mt-8">
          <Separator className="mb-4" />
          <p>ServiceDesk - Vehicle Repair Case Management System</p>
          <p>© {new Date().getFullYear()} All rights reserved</p>
        </div>
      </main>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-0 {
            border: none !important;
          }
          .print\\:break-before-page {
            break-before: page;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          .print\\:py-12 {
            padding-top: 3rem !important;
            padding-bottom: 3rem !important;
          }
          .print\\:mt-8 {
            margin-top: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}
