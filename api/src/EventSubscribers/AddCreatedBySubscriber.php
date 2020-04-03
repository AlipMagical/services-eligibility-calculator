<?php
// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


namespace App\EventSubscribers;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\ServiceDraft;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/*
 * Event subscriber that adds the created by user for all new service drafts created.
 */
final class AddCreatedBySubscriber implements EventSubscriberInterface
{
    /**
     * @var TokenStorageInterface
     */
    private $tokenStorage;

    public function __construct(TokenStorageInterface $tokenStorage)
    {
        $this->tokenStorage = $tokenStorage;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['addCreatedBy', EventPriorities::PRE_WRITE],
        ];
    }

    public function addCreatedBy(ViewEvent $event)
    {
        $service = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$service instanceof ServiceDraft ||
            (Request::METHOD_POST !== $method)) {
            // Only handle service draft creations
            return;
        }

        // Set the created by user before storing.
        $user = $this->tokenStorage->getToken()->getUser();
        $service->createdBy = $user->getUsername();
    }
}
