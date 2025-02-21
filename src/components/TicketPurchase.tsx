import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, CreditCard, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { QRCodeSVG } from 'qrcode.react';
import { cn } from '../lib/utils';

interface TicketType {
  name: string;
  price: number;
  description: string;
  benefits: string[];
}

interface TicketPurchaseProps {
  eventId: string;
  ticketTypes: TicketType[];
}

export function TicketPurchase({ eventId, ticketTypes }: TicketPurchaseProps) {
  const { darkMode, user } = useStore();
  const [selectedTicket, setSelectedTicket] = React.useState<TicketType | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [ticketQR, setTicketQR] = React.useState<string | null>(null);

  const handlePurchase = async () => {
    if (!selectedTicket || !user) return;

    setLoading(true);
    try {
      // In a real app, integrate with a payment provider here
      const paymentId = `mock_payment_${Date.now()}`;

      const { data, error } = await supabase
        .from('tickets')
        .insert({
          event_id: eventId,
          user_id: user.id,
          payment_id: paymentId,
          payment_status: 'completed',
          ticket_type: selectedTicket.name,
          price: selectedTicket.price,
          qr_code: `${eventId}_${user.id}_${Date.now()}`,
        })
        .select()
        .single();

      if (error) throw error;

      setTicketQR(data.qr_code);
      setSuccess(true);
    } catch (error) {
      console.error('Error purchasing ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {!success ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ticketTypes.map((ticket) => (
              <motion.div
                key={ticket.name}
                whileHover={{ scale: 1.02 }}
                className={cn(
                  'p-6 rounded-lg cursor-pointer border-2 transition-colors',
                  selectedTicket?.name === ticket.name
                    ? darkMode ? 'border-blue-500 bg-gray-800' : 'border-blue-500 bg-blue-50'
                    : darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white',
                )}
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className={cn(
                      'text-lg font-semibold',
                      darkMode ? 'text-white' : 'text-gray-900'
                    )}>
                      {ticket.name}
                    </h3>
                    <p className={cn(
                      'text-2xl font-bold mt-2',
                      darkMode ? 'text-white' : 'text-gray-900'
                    )}>
                      ${ticket.price}
                    </p>
                  </div>
                  <Ticket className={cn(
                    'h-6 w-6',
                    selectedTicket?.name === ticket.name
                      ? 'text-blue-500'
                      : darkMode ? 'text-gray-400' : 'text-gray-500'
                  )} />
                </div>
                <p className={cn(
                  'text-sm mb-4',
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {ticket.description}
                </p>
                <ul className="space-y-2">
                  {ticket.benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className={cn(
                        'text-sm flex items-center',
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      )}
                    >
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {selectedTicket && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePurchase}
                disabled={loading}
                className={cn(
                  'w-full py-3 px-4 rounded-lg font-medium text-white transition-colors flex items-center justify-center',
                  loading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                )}
              >
                <CreditCard className="h-5 w-5 mr-2" />
                {loading ? 'Processing...' : `Purchase ${selectedTicket.name} Ticket`}
              </motion.button>
            </motion.div>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            'p-8 rounded-lg text-center',
            darkMode ? 'bg-gray-800' : 'bg-white'
          )}
        >
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center">
              <Check className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className={cn(
            'text-2xl font-bold mb-4',
            darkMode ? 'text-white' : 'text-gray-900'
          )}>
            Ticket Purchased Successfully!
          </h2>
          {ticketQR && (
            <div className="mt-8 flex justify-center">
              <QRCodeSVG
                value={ticketQR}
                size={200}
                level="H"
                includeMargin
                className={darkMode ? 'bg-white p-2 rounded' : undefined}
              />
            </div>
          )}
          <p className={cn(
            'mt-4 text-sm',
            darkMode ? 'text-gray-400' : 'text-gray-600'
          )}>
            Please save your QR code. You'll need it to check in at the event.
          </p>
        </motion.div>
      )}
    </div>
  );
}