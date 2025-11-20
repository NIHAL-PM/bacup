import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Send, Users, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WHATSAPP_TEMPLATES } from '@/lib/whatsappTemplates';

interface BulkMessage {
  id: string;
  name: string;
  phone: string;
  status: 'pending' | 'sending' | 'sent' | 'failed';
  error?: string;
}

interface BulkWhatsAppMessagingProps {
  attendees: Array<{
    _id: string;
    name: string;
    fullName?: string;
    phone: string;
    contactNumber?: string;
    email: string;
    paymentStatus: string;
  }>;
  onClose: () => void;
}

export default function BulkWhatsAppMessaging({ attendees, onClose }: BulkWhatsAppMessagingProps) {
  const [selectedMessageType, setSelectedMessageType] = useState<keyof typeof WHATSAPP_TEMPLATES>('initial');
  const [customMessage, setCustomMessage] = useState('');
  const [useCustomMessage, setUseCustomMessage] = useState(false);
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [messageResults, setMessageResults] = useState<BulkMessage[]>([]);
  const [showResults, setShowResults] = useState(false);

  const messageTypes = Object.keys(WHATSAPP_TEMPLATES) as Array<keyof typeof WHATSAPP_TEMPLATES>;

  const filteredAttendees = attendees.filter(attendee => {
    const phone = attendee.contactNumber || attendee.phone;
    return phone && phone.trim() !== '';
  });

  const handleSelectAll = () => {
    if (selectedAttendees.length === filteredAttendees.length) {
      setSelectedAttendees([]);
    } else {
      setSelectedAttendees(filteredAttendees.map(a => a._id));
    }
  };

  const handleSelectAttendee = (attendeeId: string) => {
    setSelectedAttendees(prev => 
      prev.includes(attendeeId) 
        ? prev.filter(id => id !== attendeeId)
        : [...prev, attendeeId]
    );
  };

  const getMessagePreview = (name: string) => {
    if (useCustomMessage) {
      return customMessage.replace(/\{name\}/g, name);
    }
    return WHATSAPP_TEMPLATES[selectedMessageType](name);
  };

  const sendBulkMessages = async () => {
    if (selectedAttendees.length === 0) {
      alert('Please select at least one attendee');
      return;
    }

    setIsSending(true);
    setShowResults(true);
    
    const results: BulkMessage[] = [];
    const selectedAttendeeData = filteredAttendees.filter(a => selectedAttendees.includes(a._id));

    for (const attendee of selectedAttendeeData) {
      const result: BulkMessage = {
        id: attendee._id,
        name: attendee.fullName || attendee.name,
        phone: attendee.contactNumber || attendee.phone,
        status: 'sending'
      };
      
      results.push(result);
      setMessageResults([...results]);

      try {
        const message = getMessagePreview(result.name);
        const response = await fetch('/api/send-reminder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            registrationId: attendee._id,
            type: useCustomMessage ? 'custom' : selectedMessageType,
            customMessage: useCustomMessage ? message : undefined
          }),
        });

        if (response.ok) {
          result.status = 'sent';
        } else {
          const errorData = await response.json();
          result.status = 'failed';
          result.error = errorData.error || 'Failed to send message';
        }
      } catch (error) {
        result.status = 'failed';
        result.error = error instanceof Error ? error.message : 'Network error';
      }
      
      setMessageResults([...results]);
      
      // Add delay between messages to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setIsSending(false);
  };

  const successfulSends = messageResults.filter(r => r.status === 'sent').length;
  const failedSends = messageResults.filter(r => r.status === 'failed').length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold">Bulk WhatsApp Messaging</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <XCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {!showResults ? (
            <div className="space-y-6">
              {/* Message Configuration */}
              <div className="space-y-4">
                <div>
                  <Label>Message Type</Label>
                  <Select value={selectedMessageType} onValueChange={(value) => setSelectedMessageType(value as keyof typeof WHATSAPP_TEMPLATES)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {messageTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="custom-message"
                    checked={useCustomMessage}
                    onChange={(e) => setUseCustomMessage(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="custom-message">Use custom message</Label>
                </div>

                {useCustomMessage && (
                  <div>
                    <Label>Custom Message (use {name} for attendee name)</Label>
                    <Textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Enter your custom message. Use {name} to insert attendee name."
                      rows={4}
                    />
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <Label>Message Preview:</Label>
                  <p className="text-sm text-gray-600 mt-2">
                    {getMessagePreview('John Doe')}
                  </p>
                </div>
              </div>

              {/* Attendee Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Select Attendees ({selectedAttendees.length} selected)</Label>
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    {selectedAttendees.length === filteredAttendees.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>

                <div className="border rounded-lg max-h-64 overflow-y-auto">
                  {filteredAttendees.map(attendee => (
                    <div key={attendee._id} className="flex items-center p-3 border-b last:border-b-0 hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={selectedAttendees.includes(attendee._id)}
                        onChange={() => handleSelectAttendee(attendee._id)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{attendee.fullName || attendee.name}</div>
                        <div className="text-sm text-gray-600">{attendee.email}</div>
                        <div className="text-sm text-gray-500">{attendee.contactNumber || attendee.phone}</div>
                      </div>
                      <Badge variant={attendee.paymentStatus === 'confirmed' ? 'success' : 'warning'}>
                        {attendee.paymentStatus}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {filteredAttendees.length === 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No attendees with valid phone numbers found.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Message Results</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{successfulSends} sent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm">{failedSends} failed</span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg max-h-96 overflow-y-auto">
                {messageResults.map(result => (
                  <div key={result.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                    <div className="flex-1">
                      <div className="font-medium">{result.name}</div>
                      <div className="text-sm text-gray-600">{result.phone}</div>
                      {result.error && (
                        <div className="text-sm text-red-600 mt-1">{result.error}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {result.status === 'sent' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {result.status === 'failed' && <XCircle className="h-4 w-4 text-red-600" />}
                      {result.status === 'sending' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>}
                      <Badge variant={
                        result.status === 'sent' ? 'success' : 
                        result.status === 'failed' ? 'destructive' : 
                        'secondary'
                      }>
                        {result.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-between">
          {!showResults ? (
            <>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={sendBulkMessages} 
                disabled={isSending || selectedAttendees.length === 0 || filteredAttendees.length === 0}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Send Messages ({selectedAttendees.length})
              </Button>
            </>
          ) : (
            <Button onClick={onClose} className="ml-auto">
              Close
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}