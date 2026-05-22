package com.acadprobot.admin;

import com.acadprobot.admin.model.Chatbots;
import com.acadprobot.admin.model.User;
import com.acadprobot.admin.model.UserChatbotID;
import com.acadprobot.admin.model.UserChatbots;
import com.acadprobot.admin.repository.ChatbotRepository;
import com.acadprobot.admin.repository.UserChatbotRepository;
import com.acadprobot.admin.repository.UserRepository;
import com.acadprobot.admin.service.ChatbotService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@SpringBootTest(properties = "app.email.queue.enabled=false")
class AcadProBotAdminServiceApplicationTests {
	@InjectMocks
	private ChatbotService userChatbotService;

	@Mock
	private ChatbotRepository chatbotRepository;

	@Mock
	private UserRepository userRepository;

	@Mock
	private UserChatbotRepository userChatbotRepository;

	private UUID userId;
	private UUID chatbotId;
	private String referCode;

	private User user;
	private Chatbots chatbot;

	@Test
	void contextLoads() {
	}

	@BeforeEach
	void setUp() {
		userId = UUID.randomUUID();
		chatbotId = UUID.randomUUID();
		referCode = "ABC123";

		user = new User();
		user.setId(userId);

		chatbot = new Chatbots();
		chatbot.setId(chatbotId);
		chatbot.setRefercode(referCode);
	}

	@Test
	void joinChatbot_success() {
		UserChatbotID id = new UserChatbotID(userId, chatbotId);

		when(chatbotRepository.findByRefercode(referCode))
				.thenReturn(Optional.of(chatbot));

		when(userRepository.findById(userId))
				.thenReturn(Optional.of(user));

		when(userChatbotRepository.existsById(id))
				.thenReturn(false);

		when(userChatbotRepository.save(any(UserChatbots.class)))
				.thenAnswer(invocation -> invocation.getArgument(0));

		UserChatbots result = userChatbotService.joinChatbot(userId, referCode);

		assertNotNull(result);
		assertEquals(user, result.getUser());
		assertEquals(chatbot, result.getChatbot());
		assertEquals(id, result.getId());

		verify(userChatbotRepository).save(any(UserChatbots.class));
	}

	@Test
	void joinChatbot_chatbotNotFound() {
		when(chatbotRepository.findByRefercode(referCode))
				.thenReturn(Optional.empty());

		RuntimeException ex = assertThrows(RuntimeException.class,
				() -> userChatbotService.joinChatbot(userId, referCode));

		assertEquals("Chatbot not found", ex.getMessage());
	}

	@Test
	void joinChatbot_userAlreadyJoined() {
		UserChatbotID id = new UserChatbotID(userId, chatbotId);

		when(chatbotRepository.findByRefercode(referCode))
				.thenReturn(Optional.of(chatbot));

		when(userRepository.findById(userId))
				.thenReturn(Optional.of(user));

		when(userChatbotRepository.existsById(id))
				.thenReturn(true);

		RuntimeException ex = assertThrows(RuntimeException.class,
				() -> userChatbotService.joinChatbot(userId, referCode));

		assertEquals("User already joined this chatbot", ex.getMessage());

		verify(userChatbotRepository, never()).save(any());
	}

	@Test
	void leaveChatbot_success() {
		UserChatbotID id = new UserChatbotID(userId, chatbotId);

		UserChatbots join = new UserChatbots();
		join.setId(id);
		join.setUser(user);
		join.setChatbot(chatbot);

		when(userChatbotRepository.findById(id))
				.thenReturn(Optional.of(join));

		UserChatbots result = userChatbotService.leaveChatbot(userId, chatbotId);

		assertNotNull(result);
		assertEquals(join, result);

		verify(userChatbotRepository).delete(join);
	}

	@Test
	void leaveChatbot_userNotJoined() {
		UserChatbotID id = new UserChatbotID(userId, chatbotId);

		when(userChatbotRepository.findById(id))
				.thenReturn(Optional.empty());

		RuntimeException ex = assertThrows(RuntimeException.class,
				() -> userChatbotService.leaveChatbot(userId, chatbotId));

		assertEquals("User has not joined this chatbot", ex.getMessage());

		verify(userChatbotRepository, never()).delete(any());
	}


}
