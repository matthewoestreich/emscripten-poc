#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>

void* thread_func(void* arg) {
    int id = *(int*)arg;
    printf("Hello from thread %d!\n", id);
    return NULL;
}

int main() {
    printf("Hello from main!\n");

    pthread_t thread;
    int id = 1;

    if (pthread_create(&thread, NULL, thread_func, &id)) {
        fprintf(stderr, "Error creating thread\n");
        return 1;
    }

    pthread_join(thread, NULL);

    printf("Back in main after thread finished.\n");
    return 0;
}
