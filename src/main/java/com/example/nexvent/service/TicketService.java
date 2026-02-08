package com.example.nexvent.service;

import com.example.nexvent.model.EventRegistration;
import com.example.nexvent.model.Ticket;
import com.example.nexvent.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository tickets;

    public Ticket issueFor(EventRegistration reg) {
        // если билет уже есть — не создаём второй
        if (reg.getTicket() != null) return reg.getTicket();

        Ticket t = new Ticket();
        t.setRegistration(reg);
        t.setPrice(reg.getUnitPrice() == null ? 0L : reg.getUnitPrice());

        String code = UUID.randomUUID().toString().replace("-", "");
        t.setTicketCode(code);

        // QR-данные: можно сделать простую строку (потом можно шифровать/подписывать)
        t.setQrData("ticket:" + code + "|event:" + reg.getEvent().getId() + "|user:" + reg.getUser().getId());

        return tickets.save(t);
    }
}
