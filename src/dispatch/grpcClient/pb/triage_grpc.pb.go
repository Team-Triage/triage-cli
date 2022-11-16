// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.2.0
// - protoc             v3.6.1
// source: triage.proto

package pb

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

// MessageHandlerClient is the client API for MessageHandler service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type MessageHandlerClient interface {
	SendMessage(ctx context.Context, in *Message, opts ...grpc.CallOption) (*MessageResponse, error)
}

type messageHandlerClient struct {
	cc grpc.ClientConnInterface
}

func NewMessageHandlerClient(cc grpc.ClientConnInterface) MessageHandlerClient {
	return &messageHandlerClient{cc}
}

func (c *messageHandlerClient) SendMessage(ctx context.Context, in *Message, opts ...grpc.CallOption) (*MessageResponse, error) {
	out := new(MessageResponse)
	err := c.cc.Invoke(ctx, "/triage.MessageHandler/SendMessage", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// MessageHandlerServer is the server API for MessageHandler service.
// All implementations must embed UnimplementedMessageHandlerServer
// for forward compatibility
type MessageHandlerServer interface {
	SendMessage(context.Context, *Message) (*MessageResponse, error)
	mustEmbedUnimplementedMessageHandlerServer()
}

// UnimplementedMessageHandlerServer must be embedded to have forward compatible implementations.
type UnimplementedMessageHandlerServer struct {
}

func (UnimplementedMessageHandlerServer) SendMessage(context.Context, *Message) (*MessageResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method SendMessage not implemented")
}
func (UnimplementedMessageHandlerServer) mustEmbedUnimplementedMessageHandlerServer() {}

// UnsafeMessageHandlerServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to MessageHandlerServer will
// result in compilation errors.
type UnsafeMessageHandlerServer interface {
	mustEmbedUnimplementedMessageHandlerServer()
}

func RegisterMessageHandlerServer(s grpc.ServiceRegistrar, srv MessageHandlerServer) {
	s.RegisterService(&MessageHandler_ServiceDesc, srv)
}

func _MessageHandler_SendMessage_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(Message)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MessageHandlerServer).SendMessage(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/triage.MessageHandler/SendMessage",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MessageHandlerServer).SendMessage(ctx, req.(*Message))
	}
	return interceptor(ctx, in, info, handler)
}

// MessageHandler_ServiceDesc is the grpc.ServiceDesc for MessageHandler service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var MessageHandler_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "triage.MessageHandler",
	HandlerType: (*MessageHandlerServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "SendMessage",
			Handler:    _MessageHandler_SendMessage_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "triage.proto",
}