#include <config.h>

#include <errno.h>
#include <unistd.h>

#ifdef _WIN32_
#include <winsock2.h>
#include <ws2tcpip.h>
#include <stdio.h>
#else
#include <netdb.h>
#include <sys/socket.h>
#include <netinet.h>
#endif

struct addrinfo *result = NULL, *ptr = NULL, hints;

int main(int argsc, char** argsv)
{
    printf("%s\n", Overtop::Messages::SVR_START_MSG);

    /** 
     * Init WSA
     */
    WSADATA wsaData;
    int iResult;
    iResult = WSAStartup(MAKEWORD(2,2), &wsaData);
    if(iResult != 0)
    {
        printf("WSAStartup failed: %i\n", iResult);
        return 1;
    }

    ZeroMemory(&hints, sizeof(hints));
    hints.ai_family = AF_INET;
    hints.ai_socktype = SOCK_STREAM;
    hints.ai_protocol = IPPROTO_TCP;
    hints.ai_flags = AI_PASSIVE;

    /**
     * getaddrinfo
     */
    iResult = getaddrinfo(NULL, "27015", &hints, &result);
    if(iResult != 0)
    {
        printf("getaddrinfo failed: %i\n", iResult);
        WSACleanup();
        return 1;
    }

    /**
     * Create a socket
     */
    SOCKET ListenSocket = INVALID_SOCKET;
    ListenSocket = socket(result->ai_family, result->ai_socktype, result->ai_protocol);
    if(ListenSocket == INVALID_SOCKET)
    {
        printf("Error at socket(): %ld\n", WSAGetLastError());
        freeaddrinfo(result);
        WSACleanup();
        return 1;
    }

    /**
     * Binding the socket
     */
    iResult = bind(ListenSocket, result->ai_addr, (int)result->ai_addrlen);
    if(iResult == SOCKET_ERROR)
    {
        printf("bind failed with error: %ld\n", WSAGetLastError());
        freeaddrinfo(result);
        closesocket(ListenSocket);
        WSACleanup();
        return 1;
    }

    /**
     * Listen to the socket
     */
    if(listen(ListenSocket, SOMAXCONN) == SOCKET_ERROR)
    {
        printf("Listen failed with error: %ld\n", WSAGetLastError());
        closesocket(ListenSocket);
        WSACleanup();
        return 1;
    }

    /**
     * Accept a connection on the socket
     */
    SOCKET ClientSocket = INVALID_SOCKET;
    ClientSocket = accept(ListenSocket, NULL, NULL);
    if(ClientSocket == INVALID_SOCKET) 
    {
        printf("accept failed: %ld\n", WSAGetLastError());
        closesocket(ListenSocket);
        WSACleanup();
        return 1;
    }

    char recvbuf[512];
    int iSendResult;
    int revcbuflen = 512;

    // Receive until the peer shuts down the connection
    do
    {

        iResult = recv(ClientSocket, recvbuf, revcbuflen, 0);
        if(iResult > 0)
        {
            printf("Bytes recieved: %d\n", iResult);
            iSendResult = send(ClientSocket, recvbuf, iResult, 0);
            if(iSendResult == SOCKET_ERROR)
            {
                printf("Send failed: %ld\n", WSAGetLastError());
                closesocket(ClientSocket);
                WSACleanup();
                return 1;
            }
            printf("Bytes send: %d\n", iSendResult);
        }else if(iResult == 0)
        {
            printf("Connection closing...\n");
        }else{
            printf("recv failed: %ld\n", WSAGetLastError());
            closesocket(ClientSocket);
            WSACleanup();
            return 1;
        }

    }while(iResult > 0);


    /**
     * Shutdown the client side connection because no more data will be sent
     */
    iResult = shutdown(ClientSocket, SD_SEND);
    if(iResult == SOCKET_ERROR)
    {
        printf("shutdown failed: %ld\n", WSAGetLastError());
        closesocket(ClientSocket);
        WSACleanup();
        return 1;
    }

    printf("%s\n", Overtop::Messages::SVR_STOP_MSG);
    closesocket(ClientSocket);
    WSACleanup();
    return 0;
}