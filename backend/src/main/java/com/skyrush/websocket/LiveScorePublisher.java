package com.skyrush.websocket;

import com.skyrush.dto.leaderboard.LiveScoreEvent;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

/**
 * Publishes live score events to /topic/leaderboard after each score submission.
 * Frontend subscribes to this topic for real-time leaderboard updates.
 */
@Service
public class LiveScorePublisher {

    private final SimpMessagingTemplate messagingTemplate;

    public LiveScorePublisher(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void publish(String username, int score, int height) {
        messagingTemplate.convertAndSend("/topic/leaderboard", new LiveScoreEvent(username, score, height));
    }
}
