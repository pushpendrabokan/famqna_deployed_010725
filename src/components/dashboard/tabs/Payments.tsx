import React from 'react';
import { Building2 as BankIcon, FileCheck, InfoIcon, CheckCircle } from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { Creator } from '../../../types';

interface PaymentsProps {
  creator: Creator;
  onUpdateBank: () => void;
  onUpdateKYC: () => void;
}

const Payments: React.FC<PaymentsProps> = ({ creator, onUpdateBank, onUpdateKYC }) => {
  const getStatusBadgeColor = (status: string | undefined) => {
    if (!status) return 'bg-accent-green/20 text-accent-green'; // Default to verified if no status
    
    switch (status) {
      case 'verified': return 'bg-accent-green/20 text-accent-green';
      case 'pending': return 'bg-accent-blue/20 text-accent-blue';
      case 'rejected': return 'bg-red-500/20 text-red-500';
      default: return 'bg-accent-blue/20 text-accent-blue';
    }
  };

  const formatStatusText = (status: string | undefined) => {
    if (!status) return 'Verified';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-deep-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
            <BankIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">Bank Account</h3>
            <p className="text-light-300 text-sm">Manage your connected bank account</p>
          </div>
        </div>

        {creator.bankDetails ? (
          <div className="space-y-4">
            <div className="bg-deep-200 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-light-300">Account Number</p>
                  <p className="text-light-100">••••{creator.bankDetails.accountNumber.slice(-4)}</p>
                </div>
                <div>
                  <p className="text-sm text-light-300">IFSC Code</p>
                  <p className="text-light-100">{creator.bankDetails.ifsc}</p>
                </div>
                <div>
                  <p className="text-sm text-light-300">Account Holder</p>
                  <p className="text-light-100">{creator.bankDetails.name}</p>
                </div>
                <div>
                  <p className="text-sm text-light-300">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      getStatusBadgeColor(creator.bankDetails.status)
                    }`}>
                      {formatStatusText(creator.bankDetails.status)}
                    </span>
                    {(creator.bankDetails.status === 'verified' || !creator.bankDetails.status) && (
                      <CheckCircle className="w-4 h-4 text-accent-green" />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-accent-blue/10 p-4 rounded-lg border border-accent-blue/20">
              <div className="flex gap-3">
                <InfoIcon className="text-accent-blue flex-shrink-0 w-5 h-5 mt-1" />
                <div>
                  <h4 className="text-white font-medium mb-1">Direct Payment Processing</h4>
                  <p className="text-light-300 text-sm">
                    You receive 80% of every question payment directly to your bank account. 
                    This gives you more income for the value you provide to your audience.
                  </p>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={onUpdateBank}>Update Bank Details</Button>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-light-300 mb-4">No bank account connected</p>
            <Button variant="gradient" onClick={onUpdateBank}>Connect Bank Account</Button>
          </div>
        )}
      </Card>

      <Card className="bg-deep-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
            <FileCheck className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">KYC Status</h3>
            <p className="text-light-300 text-sm">Verify your identity to receive payments</p>
          </div>
        </div>

        {creator.kycDetails ? (
          <div className="space-y-4">
            <div className="bg-deep-200 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-light-300">PAN Number</p>
                  <p className="text-light-100">••••{creator.kycDetails.pan.slice(-4)}</p>
                </div>
                {creator.kycDetails.gst && (
                  <div>
                    <p className="text-sm text-light-300">GST Number</p>
                    <p className="text-light-100">{creator.kycDetails.gst}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-light-300">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      getStatusBadgeColor(creator.kycDetails.status)
                    }`}>
                      {formatStatusText(creator.kycDetails.status)}
                    </span>
                    {(creator.kycDetails.status === 'verified' || !creator.kycDetails.status) && (
                      <CheckCircle className="w-4 h-4 text-accent-green" />
                    )}
                  </div>
                </div>
              </div>
            </div>
            {creator.kycDetails.status === 'rejected' && (
              <Button variant="gradient" onClick={onUpdateKYC}>Update KYC Details</Button>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-light-300 mb-4">KYC verification pending</p>
            <Button variant="gradient" onClick={onUpdateKYC}>Complete KYC</Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Payments;