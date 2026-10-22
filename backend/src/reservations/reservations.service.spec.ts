import { ConflictException } from "@nestjs/common";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { tx, prismaMock } = vi.hoisted(() => {
    const tx = {
        $queryRaw: vi.fn(),
        reservation: {
            findUnique: vi.fn(),
            count: vi.fn(),
            update: vi.fn(),
            create: vi.fn(),
        },
    };

    const prismaMock = {
        $transaction: vi.fn(async (callback: (client: typeof tx) => Promise<unknown>) => callback(tx)),
        reservation: {
            findUnique: vi.fn(),
            update: vi.fn(),
        },
    };

    return { tx, prismaMock };
});

vi.mock("../lib/prisma.js", () => ({
    prisma: prismaMock,
}));

import { ReservationsService } from "./reservations.service.js";

const futureEvent = {
    id: 1,
    capacity: 2,
    date: new Date("2027-12-01T18:00:00.000Z"),
};

describe("ReservationsService", () => {
    const service = new ReservationsService();

    beforeEach(() => {
        vi.clearAllMocks();
        prismaMock.$transaction.mockImplementation(async (callback) => callback(tx));
    });

    it("cria a reserva quando ainda há vaga", async () => {
        tx.$queryRaw.mockResolvedValue([futureEvent]);
        tx.reservation.findUnique.mockResolvedValue(null);
        tx.reservation.count.mockResolvedValue(0);
        tx.reservation.create.mockResolvedValue({ id: 10, status: "reserved" });

        await expect(service.create(1, 2)).resolves.toMatchObject({ id: 10, status: "reserved" });
        expect(tx.reservation.create).toHaveBeenCalledWith({
            data: {
                userId: 2,
                eventId: 1,
                status: "reserved",
            },
        });
    });

    it("recusa quando a pessoa já reservou", async () => {
        tx.$queryRaw.mockResolvedValue([futureEvent]);
        tx.reservation.findUnique.mockResolvedValue({ id: 10, status: "reserved" });

        await expect(service.create(1, 2)).rejects.toBeInstanceOf(ConflictException);
        expect(tx.reservation.create).not.toHaveBeenCalled();
    });

    it("recusa quando o evento está lotado", async () => {
        tx.$queryRaw.mockResolvedValue([{ ...futureEvent, capacity: 1 }]);
        tx.reservation.findUnique.mockResolvedValue(null);
        tx.reservation.count.mockResolvedValue(1);

        await expect(service.create(1, 2)).rejects.toBeInstanceOf(ConflictException);
        expect(tx.reservation.create).not.toHaveBeenCalled();
    });

    it("cancela a reserva da própria pessoa", async () => {
        prismaMock.reservation.findUnique.mockResolvedValue({
            id: 10,
            userId: 2,
            status: "reserved",
        });
        prismaMock.reservation.update.mockResolvedValue({ id: 10, status: "cancelled" });

        await expect(service.cancel(10, 2)).resolves.toMatchObject({ status: "cancelled" });
        expect(prismaMock.reservation.update).toHaveBeenCalledWith({
            where: { id: 10 },
            data: { status: "cancelled" },
        });
    });
});
