import * as React from "react";
import render, { act } from 'hooks-test-util'
import useForm from '../index'

describe("use-form getValue test", () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should get current value when excute getValue method', () => {
    const initialData = {
      name: 'test username',
      password: 'test password',
    }

    const { container } = render(() => {
      return useForm(initialData)
    })

    expect(container.hook[0].getValue()).toEqual({
      ...initialData,
    })
  })

  it('should get current value after some field change', () => {
    const initialData = {
      name: 'test username',
      password: 'test password',
    }

    const { container } = render(() => {
      return useForm(initialData)
    })
    act(() => {
      const field = container.hook[1]
      field('name').onChange('hello')
    })
    expect(container.hook[0].getValue()).toEqual({
      ...initialData,
      name: 'hello'
    })
  })

  it('should get current value in custom validator', function () {
    const initialData = {
      name: 'test username',
      password: 'test password',
      apassword: 'test password',
    }

    const { container } = render(() => {
      return useForm(initialData)
    })


    let password
    const text = 'yayayayaya'

    container.hook[1]("apassword", {
      rules: [{
        type: "string",
        validator: (rule, value, callback)=>{
          password = container.hook[0].getValue().password
          if(value != password){
            callback("两次输入的密码不一致！")
          }
          callback();
        }
      }]
    })

    act(() => {
      const field = container.hook[1]
      field('password').onChange(text)
    })

    expect(password).toEqual(text)
  })
})
