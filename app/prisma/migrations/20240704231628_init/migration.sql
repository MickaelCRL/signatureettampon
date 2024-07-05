-- CreateTable
CREATE TABLE "User" (
    "idUser" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "idSubscription" TEXT,
    "idEnvelope" TEXT,
    CONSTRAINT "User_idSubscription_fkey" FOREIGN KEY ("idSubscription") REFERENCES "Subscription" ("idSubscription") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_idEnvelope_fkey" FOREIGN KEY ("idEnvelope") REFERENCES "Envelope" ("idEnvelope") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Subscription" (
    "idSubscription" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "envelopeSize" INTEGER NOT NULL,
    "price" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Envelope" (
    "idEnvelope" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "hash" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Document" (
    "idDocument" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "isSigned" BOOLEAN NOT NULL,
    "hash" TEXT NOT NULL,
    "idEnvelope" TEXT NOT NULL,
    CONSTRAINT "Document_idEnvelope_fkey" FOREIGN KEY ("idEnvelope") REFERENCES "Envelope" ("idEnvelope") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Signatory" (
    "idSignatory" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hasSigned" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Sign" (
    "idDocument" TEXT NOT NULL,
    "idSignatory" TEXT NOT NULL,

    PRIMARY KEY ("idDocument", "idSignatory"),
    CONSTRAINT "Sign_idDocument_fkey" FOREIGN KEY ("idDocument") REFERENCES "Document" ("idDocument") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Sign_idSignatory_fkey" FOREIGN KEY ("idSignatory") REFERENCES "Signatory" ("idSignatory") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
