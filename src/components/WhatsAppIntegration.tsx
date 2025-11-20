import { useState } from 'react';
import { MessageCircle, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface WhatsAppIntegrationProps {
  attendee: {
    _id: string;
    fullName?: string;
    name?: string;
    contactNumber?: string;
    phone?: string;
    paymentStatus?: string;
  };
  onMessageSent?: () => void;
}

const WhatsAppIntegration = ({ attendee, onMessageSent }: WhatsAppIntegrationProps) => {
  const [isSending, setIsSending] = useState(false);
  const [showQrDialog, setShowQrDialog] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');
  const [messageType, setMessageType] = useState<string>('initial');

  const sendWhatsAppMessage = async (type: string) => {
    if (!attendee) return;

    setIsSending(true);
    try {
      const response = await fetch('/api/send-reminder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrationId: attendee._id,
          type: type,
        }),
      });

      const data = await response.json();

      if (response.status === 401 && data.qrCodeBase64) {
        // WhatsApp needs authentication - show QR code
        setQrCode(`data:image/png;base64,${data.qrCodeBase64}`);
        setShowQrDialog(true);
        toast.info('Please scan the QR code to authenticate WhatsApp');
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      toast.success('WhatsApp message sent successfully!');
      onMessageSent?.();
    } catch (error: any) {
      console.error('WhatsApp send error:', error);
      toast.error(error.message || 'Failed to send WhatsApp message');
    } finally {
      setIsSending(false);
    }
  };

  const handleSendMessage = () => {
    sendWhatsAppMessage(messageType);
  };

  const getRecommendedMessageType = () => {
    if (attendee.paymentStatus === 'confirmed') {
      return 'confirmed';
    }
    // For pending payments, you could implement logic based on registration date
    // For now, default to initial reminder
    return 'initial';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle className="w-5 h-5 text-green-600" />
        <h4 className="font-semibold">WhatsApp Messaging</h4>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium mb-2 block">Message Type</label>
          <Select value={messageType} onValueChange={setMessageType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select message type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="initial">Initial Reminder (Payment Pending)</SelectItem>
              <SelectItem value="followUp">Follow-up Reminder</SelectItem>
              <SelectItem value="finalWarning">Final Warning</SelectItem>
              <SelectItem value="confirmed">Payment Confirmed</SelectItem>
              <SelectItem value="twoDayReminder">2-Day Reminder</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleSendMessage}
            disabled={isSending}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isSending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send WhatsApp Message
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => setMessageType(getRecommendedMessageType())}
            size="sm"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Auto Select
          </Button>
        </div>
      </div>

      {/* QR Code Dialog */}
      <Dialog open={showQrDialog} onOpenChange={setShowQrDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              WhatsApp Authentication Required
            </DialogTitle>
            <DialogDescription>
              Please scan this QR code with WhatsApp on your phone to authenticate.
              <br />
              <span className="text-sm text-orange-600 font-medium">
                Open WhatsApp → Linked Devices → Link a Device
              </span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center p-4">
            {qrCode && (
              <img
                src={qrCode}
                alt="WhatsApp QR Code"
                className="w-64 h-64 border-2 border-gray-200 rounded-lg"
              />
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowQrDialog(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowQrDialog(false);
                handleSendMessage();
              }}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Retry After Scan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WhatsAppIntegration;