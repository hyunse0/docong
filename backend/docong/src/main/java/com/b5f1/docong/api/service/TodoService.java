package com.b5f1.docong.api.service;

import com.b5f1.docong.api.dto.request.ModifyTodoStatusReqDto;
import com.b5f1.docong.api.dto.request.SaveTodoReqDto;

public interface TodoService {
    Long saveTodo(SaveTodoReqDto reqDto);
    void deleteTodo(Long id);
    void modifyTodo(Long id, SaveTodoReqDto reqDto);
    void modifyStatus(Long id, ModifyTodoStatusReqDto reqDto);
}