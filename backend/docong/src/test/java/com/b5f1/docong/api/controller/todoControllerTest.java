package com.b5f1.docong.api.controller;

import com.b5f1.docong.api.dto.request.ModifyTodoStatusReqDto;
import com.b5f1.docong.api.dto.request.SaveTodoReqDto;
import com.b5f1.docong.api.service.TodoService;
import com.b5f1.docong.core.domain.todo.TodoStatus;
import com.b5f1.docong.core.domain.user.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.aspectj.lang.annotation.Before;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc(addFilters = false)
@SpringBootTest
class todoControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TodoService todoService;


    @Test
    void testSaveTodo() throws Exception{
        // given
        SaveTodoReqDto reqDto = new SaveTodoReqDto("제목","내용",null,null,null,null,null);

        // when
        mockMvc.perform(post("/todo")
                .content(asJsonString(reqDto))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))

        // then
                .andExpect(status().isOk());
        verify(todoService,  times(1)).saveTodo(any(SaveTodoReqDto.class));
    }

    @Test
    void testDeleteTodo() throws Exception{
        // given

        // when
        mockMvc.perform(delete("/todo/{id}",1L))

                // then
                .andExpect(status().isOk());
        verify(todoService, times(1)).deleteTodo(1L);
    }

    @Test
    void testModifyTodo() throws Exception{
        // given
        SaveTodoReqDto reqDto = new SaveTodoReqDto("제목","내용",null,null,null,null,null);

        // when
        mockMvc.perform(put("/todo/{id}", 1L)
                        .content(asJsonString(reqDto))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))

                // then
                .andExpect(status().isOk());
        verify(todoService,  times(1)).modifyTodo(eq(1L), any(SaveTodoReqDto.class));
    }

    @Test
    void testModifyStatus() throws Exception{
        // given
        ModifyTodoStatusReqDto reqDto = new ModifyTodoStatusReqDto(TodoStatus.IN_PROGRESS);

        // when
        mockMvc.perform(put("/todo/status/{id}", 1L)
                        .content(asJsonString(reqDto))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))

                // then
                .andExpect(status().isOk());
        verify(todoService,  times(1)).modifyStatus(eq(1L), any(ModifyTodoStatusReqDto.class));
    }

    public static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().registerModule(new JavaTimeModule()).writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}