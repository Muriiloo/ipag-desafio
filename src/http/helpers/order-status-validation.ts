//sequencia de status permitidos
const STATUS_SEQUENCE = [
  "pending",
  "waiting_payment",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "canceled",
];

export function isValidStatusTransition(
  currentStatus: string,
  newStatus: string
) {
  //permitir cancelamento de pedidos já entregues
  if (newStatus === "canceled" && currentStatus !== "delivered") {
    return true;
  }

  //verificar se os status existem na sequência
  const currentIndex = STATUS_SEQUENCE.indexOf(currentStatus as any);
  //verificar se o novo status existe na sequência
  const newIndex = STATUS_SEQUENCE.indexOf(newStatus as any);

  //verificar se ambos os status existem na sequência
  if (currentIndex === -1 || newIndex === -1) {
    return false;
  }

  //permitir apenas avanço sequencial (próximo status na sequência)
  return newIndex === currentIndex + 1;
}
